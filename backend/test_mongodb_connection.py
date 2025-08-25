#!/usr/bin/env python3
"""
Test MongoDB connection independently
"""
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

async def test_mongodb():
    """Test MongoDB connection"""
    try:
        from app.core.database import connect_to_mongo, db, close_mongo_connection
        
        print("🧪 Testing MongoDB Connection")
        print("=" * 40)
        
        await connect_to_mongo()
        
        if db.client and db.database:
            # Test basic operations
            collections = await db.database.list_collection_names()
            print(f"📋 Available collections: {collections}")
            
            # Test a simple operation
            test_doc = {"test": "connection", "timestamp": "2025-08-24"}
            result = await db.database.connection_test.insert_one(test_doc)
            print(f"✅ Test document inserted with ID: {result.inserted_id}")
            
            # Clean up test document
            await db.database.connection_test.delete_one({"_id": result.inserted_id})
            print("🧹 Test document cleaned up")
            
        await close_mongo_connection()
        print("✅ MongoDB connection test completed successfully!")
        
    except Exception as e:
        print(f"❌ MongoDB connection test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_mongodb())