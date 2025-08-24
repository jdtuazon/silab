from fastapi import FastAPI, HTTPException, UploadFile, File
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from datetime import datetime
import os
import random
from r2r_service import r2r_service

load_dotenv()


# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app):
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    app.mongodb = app.mongodb_client[os.getenv("DB_NAME", "silab")]
    
    # Check R2R health on startup
    try:
        health = await r2r_service.health_check()
        if health.get("status") == "ok":
            print("✅ R2R service is healthy and ready")
        else:
            print("⚠️  R2R service health check failed:", health.get("message"))
    except Exception as e:
        print(f"⚠️  R2R service startup check failed: {e}")
    
    try:
        yield
    finally:
        app.mongodb_client.close()
        await r2r_service.close()

app = FastAPI(title="SiLab API", version="1.0.0", lifespan=lifespan)


# Get allowed origins from environment variable, default to localhost for dev
origins_env = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000,http://localhost:3001")
allow_origins = [origin.strip() for origin in origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Welcome to SiLab API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

class TestData(BaseModel):
    name: str
    value: int
    category: str

class RAGQuery(BaseModel):
    query: str
    limit: int = 10
    use_hybrid_search: bool = True
    task_prompt: Optional[str] = None

@app.post("/test-data")
async def create_test_data():
    test_items = [
        {"name": "Sample Item 1", "value": random.randint(1, 100), "category": "electronics"},
        {"name": "Sample Item 2", "value": random.randint(1, 100), "category": "books"},
        {"name": "Sample Item 3", "value": random.randint(1, 100), "category": "clothing"},
        {"name": "Sample Item 4", "value": random.randint(1, 100), "category": "food"},
        {"name": "Sample Item 5", "value": random.randint(1, 100), "category": "toys"}
    ]
    
    selected_item = random.choice(test_items)
    
    document = {
        **selected_item,
        "created_at": datetime.utcnow(),
        "id": random.randint(1000, 9999)
    }
    
    try:
        result = await app.mongodb.test_collection.insert_one(document)
        document["_id"] = str(result.inserted_id)
        return {"message": "Test data created successfully", "data": document}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/test-data")
async def get_test_data():
    try:
        cursor = app.mongodb.test_collection.find().sort("created_at", -1).limit(10)
        documents = []
        async for document in cursor:
            document["_id"] = str(document["_id"])
            documents.append(document)
        return {"data": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/db-status")
async def check_db_connection():
    try:
        await app.mongodb_client.admin.command("ping")
        collections = await app.mongodb.list_collection_names()
        return {
            "status": "connected",
            "database": os.getenv("DB_NAME", "silab"),
            "collections": collections
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

# R2R RAG Endpoints

@app.get("/r2r/health")
async def r2r_health_check():
    """Check R2R service health"""
    try:
        health = await r2r_service.health_check()
        return health
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/r2r/ingest")
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

@app.post("/r2r/search")
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

@app.post("/r2r/chat")
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

@app.get("/r2r/documents")
async def get_documents(limit: int = 10, offset: int = 0):
    """Get list of ingested documents"""
    try:
        result = await r2r_service.get_documents(limit=limit, offset=offset)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/r2r/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document from R2R"""
    try:
        result = await r2r_service.delete_document(document_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)