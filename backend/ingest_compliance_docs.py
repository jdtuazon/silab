#!/usr/bin/env python3
"""
Compliance Documents RAG Ingestion Script
Ingests compliance documents into R2R with fast ingestion mode and RAG-Fusion
"""

import asyncio
import os
from pathlib import Path
import httpx
from datetime import datetime
import mimetypes
import json

class ComplianceRAGIngester:
    def __init__(self, r2r_base_url="http://localhost:7272"):
        self.base_url = r2r_base_url
        self.client = httpx.AsyncClient(timeout=120.0)  # Longer timeout for large files
        self.compliance_dir = Path(__file__).parent / "Compliance Documents"
        
    async def setup_collection(self):
        """Create a collection for compliance documents"""
        try:
            collection_data = {
                "name": "Compliance Documents",
                "description": "Collection of regulatory compliance documents, circulars, and acts"
            }
            
            response = await self.client.post(
                f"{self.base_url}/v3/collections",
                json=collection_data
            )
            
            if response.status_code in [200, 201]:
                collection = response.json()
                print(f"✅ Created collection: {collection.get('results', {}).get('name', 'Compliance Documents')}")
                return collection.get('results', {}).get('id')
            elif response.status_code == 400:
                # Collection might already exist
                print("📂 Collection may already exist, continuing...")
                return None
            else:
                print(f"⚠️  Collection creation failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating collection: {e}")
            return None
    
    async def ingest_document(self, file_path: Path, collection_id=None):
        """Ingest a single document with fast ingestion mode"""
        try:
            print(f"📄 Ingesting: {file_path.name}")
            
            # Prepare metadata
            metadata = {
                "filename": file_path.name,
                "file_type": file_path.suffix.lower(),
                "ingestion_mode": "fast",
                "rag_fusion": True,
                "document_type": "compliance",
                "ingestion_date": datetime.utcnow().isoformat(),
                "file_size": file_path.stat().st_size
            }
            
            # Detect content type
            content_type, _ = mimetypes.guess_type(str(file_path))
            if not content_type:
                content_type = 'application/pdf' if file_path.suffix.lower() == '.pdf' else 'application/octet-stream'
            
            # Prepare files for upload
            with open(file_path, 'rb') as f:
                files = {
                    "file": (file_path.name, f, content_type)
                }
                
                data = {
                    "metadata": json.dumps(metadata)
                }
                
                if collection_id:
                    data["collection_ids"] = json.dumps([collection_id])
                
                # Upload document
                response = await self.client.post(
                    f"{self.base_url}/v3/documents",
                    files=files,
                    data=data
                )
            
            if response.status_code in [200, 201, 202]:
                result = response.json()
                document_id = result.get('results', {}).get('document_id', 'unknown')
                task_id = result.get('results', {}).get('task_id', 'unknown')
                
                if response.status_code == 202:
                    print(f"  ✅ Queued for processing - Document ID: {document_id}, Task ID: {task_id}")
                else:
                    print(f"  ✅ Ingested successfully - Document ID: {document_id}")
                return document_id
            else:
                print(f"  ❌ Failed to ingest: {response.status_code} - {response.text[:200]}")
                return None
                
        except Exception as e:
            print(f"  ❌ Error ingesting {file_path.name}: {e}")
            return None
    
    async def ingest_all_documents(self):
        """Ingest all documents in the compliance directory"""
        if not self.compliance_dir.exists():
            print(f"❌ Compliance Documents directory not found: {self.compliance_dir}")
            return
        
        # Get all PDF files
        pdf_files = list(self.compliance_dir.glob("*.pdf"))
        if not pdf_files:
            print("❌ No PDF files found in Compliance Documents directory")
            return
        
        print(f"🚀 Starting ingestion of {len(pdf_files)} compliance documents...")
        print(f"📂 Directory: {self.compliance_dir}")
        
        # Setup collection
        collection_id = await self.setup_collection()
        
        # Ingest documents
        successful_ingestions = 0
        failed_ingestions = 0
        
        for pdf_file in pdf_files:
            document_id = await self.ingest_document(pdf_file, collection_id)
            if document_id:
                successful_ingestions += 1
                # Small delay to avoid overwhelming the system
                await asyncio.sleep(1)
            else:
                failed_ingestions += 1
        
        # Summary
        print(f"\n📊 Ingestion Summary:")
        print(f"  ✅ Successfully ingested: {successful_ingestions}")
        print(f"  ❌ Failed ingestions: {failed_ingestions}")
        print(f"  📄 Total documents processed: {len(pdf_files)}")
        
        if successful_ingestions > 0:
            print(f"\n🎉 RAG pipeline is ready! Documents are embedded and searchable.")
            print(f"💡 You can now query compliance documents using the /r2r/chat endpoint")
        
    async def test_search(self, query="What are the key compliance requirements?"):
        """Test search functionality after ingestion"""
        try:
            print(f"\n🔍 Testing search with query: '{query}'")
            
            search_data = {
                "query": query,
                "search_settings": {
                    "limit": 5,
                    "use_hybrid_search": True
                }
            }
            
            response = await self.client.post(
                f"{self.base_url}/v3/chunks/search",
                json=search_data
            )
            
            if response.status_code == 200:
                results = response.json()
                chunks = results.get('results', [])
                print(f"  📝 Found {len(chunks)} relevant chunks")
                
                for i, chunk in enumerate(chunks[:3], 1):
                    metadata = chunk.get('metadata', {})
                    filename = metadata.get('filename', 'Unknown file')
                    score = chunk.get('score', 0)
                    text_preview = chunk.get('text', '')[:150] + "..."
                    print(f"  {i}. {filename} (Score: {score:.3f})")
                    print(f"     {text_preview}")
                    print()
            else:
                print(f"  ❌ Search failed: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ Search test error: {e}")
    
    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()

async def main():
    """Main execution function"""
    print("🏛️  SiLab Compliance Documents RAG Ingestion")
    print("=" * 50)
    
    ingester = ComplianceRAGIngester()
    
    try:
        # Check R2R health
        health_response = await ingester.client.get(f"{ingester.base_url}/openapi.json")
        if health_response.status_code != 200:
            print("❌ R2R service is not running on port 7272")
            print("   Please start R2R service before running this script")
            return
        
        print("✅ R2R service is running")
        
        # Ingest all documents
        await ingester.ingest_all_documents()
        
        # Test search functionality
        await ingester.test_search()
        
        print(f"\n✨ RAG pipeline setup complete!")
        print(f"💡 Next steps:")
        print(f"   1. Start your FastAPI backend: python main.py")
        print(f"   2. Test via API: POST /r2r/chat with your compliance questions")
        print(f"   3. Use the frontend to interact with the RAG system")
        
    except KeyboardInterrupt:
        print("\n⏹️  Ingestion stopped by user")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
    finally:
        await ingester.close()

if __name__ == "__main__":
    asyncio.run(main())