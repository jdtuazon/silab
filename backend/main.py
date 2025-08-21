from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import os
import random

load_dotenv()


# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app):
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    app.mongodb = app.mongodb_client[os.getenv("DB_NAME", "silab")]
    try:
        yield
    finally:
        app.mongodb_client.close()

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)