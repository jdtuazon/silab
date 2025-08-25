"""
Database configuration and connection management
"""
from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        if not settings.mongodb_url:
            print("⚠️  MongoDB URL not configured, skipping connection")
            return
            
        db.client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=3000)
        db.database = db.client[settings.db_name]
        
        # Test the connection with timeout
        await db.client.admin.command("ping")
        print(f"✅ Connected to MongoDB: {settings.db_name}")
        
    except Exception as e:
        print(f"⚠️  MongoDB connection failed (continuing without database): {e}")
        # Don't raise the exception, just log and continue

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("✅ MongoDB connection closed")

def get_database():
    """Get database instance"""
    return db.database