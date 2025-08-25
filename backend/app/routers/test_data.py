"""
Test data endpoints
"""
from fastapi import APIRouter, HTTPException
from datetime import datetime
import random

from app.models.schemas import TestData
from app.core.database import get_database

router = APIRouter(prefix="/test-data", tags=["test-data"])

@router.post("/")
async def create_test_data():
    """Create random test data"""
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
        db = get_database()
        result = await db.test_collection.insert_one(document)
        document["_id"] = str(result.inserted_id)
        return {"message": "Test data created successfully", "data": document}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/")
async def get_test_data():
    """Get recent test data"""
    try:
        db = get_database()
        cursor = db.test_collection.find().sort("created_at", -1).limit(10)
        documents = []
        async for document in cursor:
            document["_id"] = str(document["_id"])
            documents.append(document)
        return {"data": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")