"""
RAG (Retrieval-Augmented Generation) endpoints
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from datetime import datetime

from app.models.schemas import RAGQuery
from app.services.r2r_service import r2r_service

router = APIRouter(prefix="/rag", tags=["rag"])

@router.get("/health")
async def r2r_health_check():
    """Check R2R service health"""
    try:
        health = await r2r_service.health_check()
        return health
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/ingest")
async def ingest_document(file: UploadFile = File(...)):
    """Ingest a document into R2R for RAG"""
    try:
        metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "uploaded_at": datetime.utcnow().isoformat()
        }
        
        result = await r2r_service.ingest_document(file, metadata)
        return {
            "message": "Document ingested successfully",
            "filename": file.filename,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search")
async def search_documents(query_data: RAGQuery):
    """Search documents using vector similarity"""
    try:
        results = await r2r_service.search_documents(
            query=query_data.query,
            limit=query_data.limit
        )
        return {"query": query_data.query, "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def rag_chat(query_data: RAGQuery):
    """Get RAG completion for a query"""
    try:
        result = await r2r_service.rag_completion(
            query=query_data.query,
            use_hybrid_search=query_data.use_hybrid_search,
            task_prompt=query_data.task_prompt
        )
        return {
            "query": query_data.query,
            "response": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents")
async def get_documents(limit: int = 10, offset: int = 0):
    """Get list of ingested documents"""
    try:
        result = await r2r_service.get_documents(limit=limit, offset=offset)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document from R2R"""
    try:
        result = await r2r_service.delete_document(document_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))