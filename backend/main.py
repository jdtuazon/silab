from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime
import os
import random

load_dotenv()

app = FastAPI(title="DataWave API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    app.mongodb = app.mongodb_client[os.getenv("DB_NAME", "datawave")]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

@app.get("/")
async def root():
    return {"message": "Welcome to DataWave API"}

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
            "database": os.getenv("DB_NAME", "datawave"),
            "collections": collections
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)