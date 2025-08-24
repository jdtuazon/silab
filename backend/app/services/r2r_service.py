import httpx
import os
from typing import Optional, Dict, Any, List
import tempfile
from fastapi import UploadFile
import json

from app.core.config import settings

class R2RService:
    def __init__(self):
        # Try common R2R API ports
        api_ports = [7272, 8000, 8080, 7273]
        self.base_url = settings.r2r_base_url
        
        # If no custom URL provided, detect the correct port
        if self.base_url == "http://localhost:7272":
            for port in api_ports:
                try:
                    import httpx
                    with httpx.Client(timeout=5.0) as client:
                        response = client.get(f"http://localhost:{port}/openapi.json")
                        if response.status_code == 200 and "openapi" in response.text:
                            self.base_url = f"http://localhost:{port}"
                            print(f"✅ Found R2R API on port {port}")
                            break
                except:
                    continue
        
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def health_check(self) -> Dict[str, Any]:
        """Check if R2R service is healthy"""
        try:
            # Check if R2R is running by getting openapi.json
            response = await self.client.get(f"{self.base_url}/openapi.json")
            if response.status_code == 200:
                return {"status": "ok", "message": "R2R v3 API is running"}
            else:
                return {"status": "error", "message": f"R2R returned status {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    async def ingest_document(self, file: UploadFile, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Ingest a document into R2R"""
        try:
            # Read file content
            content = await file.read()
            
            # Prepare files for multipart upload
            files = {
                "file": (file.filename, content, file.content_type)
            }
            
            # Prepare data
            data = {}
            if metadata:
                data["metadata"] = json.dumps(metadata)
            
            # Use R2R v3 documents endpoint
            response = await self.client.post(
                f"{self.base_url}/v3/documents",
                files=files,
                data=data
            )
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            raise Exception(f"Document ingestion failed: {str(e)}")
    
    async def search_documents(self, query: str, limit: int = 10) -> Dict[str, Any]:
        """Search documents using vector similarity"""
        try:
            payload = {
                "query": query,
                "vector_search_settings": {
                    "search_limit": limit
                }
            }
            
            # Use R2R v3 chunks search endpoint
            response = await self.client.post(
                f"{self.base_url}/v3/chunks/search",
                json=payload
            )
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            raise Exception(f"Document search failed: {str(e)}")
    
    async def rag_completion(self, query: str, use_hybrid_search: bool = True, task_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Get RAG completion using search + completion endpoint approach"""
        try:
            # First, get search results
            search_results = await self.search_documents(query, limit=3)
            search_chunks = search_results.get("results", [])
            
            if not search_chunks:
                return {
                    "completion": "No relevant regulatory documents found for analysis.",
                    "search_results": []
                }
            
            # Build context from search results
            context_parts = []
            for i, chunk in enumerate(search_chunks[:3], 1):
                filename = chunk.get('metadata', {}).get('filename', 'Unknown document')
                text = chunk.get('text', '')[:1000]  # Limit length
                context_parts.append(f"DOCUMENT {i} ({filename}):\n{text}")
            
            context = "\n\n".join(context_parts)
            
            # Create system message and user message
            system_msg = task_prompt or "You are a compliance analyst for Philippine financial regulations."
            
            user_msg = f"""COMPLIANCE ANALYSIS REQUEST

FINANCIAL SERVICE FEATURE: "{query}"

PHILIPPINE REGULATORY DOCUMENTS:
{context}

Please analyze if this feature violates any regulations in the provided documents. Respond in the exact format specified."""
            
            # Use completion endpoint with messages
            payload = {
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": user_msg}
                ],
                "generation_config": {
                    "model": "openai/gpt-4o-mini",
                    "temperature": 0.1,
                    "max_tokens": 500
                }
            }
            
            response = await self.client.post(
                f"{self.base_url}/v3/retrieval/completion",
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            
            # Extract the completion
            completion = result.get("results", {}).get("choices", [{}])[0].get("message", {}).get("content", "No response generated")
            
            return {
                "completion": completion,
                "search_results": search_chunks
            }
            
        except Exception as e:
            raise Exception(f"RAG completion failed: {str(e)}")
    
    async def get_documents(self, limit: int = 10, offset: int = 0) -> Dict[str, Any]:
        """Get list of ingested documents"""
        try:
            params = {
                "limit": limit,
                "offset": offset
            }
            
            response = await self.client.get(
                f"{self.base_url}/v3/documents",
                params=params
            )
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            raise Exception(f"Failed to get documents: {str(e)}")
    
    async def delete_document(self, document_id: str) -> Dict[str, Any]:
        """Delete a document from R2R"""
        try:
            response = await self.client.delete(
                f"{self.base_url}/v3/documents/{document_id}"
            )
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            raise Exception(f"Failed to delete document: {str(e)}")
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()

# Global R2R service instance
r2r_service = R2RService()