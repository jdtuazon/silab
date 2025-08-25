"""
MongoEngine connection management
"""
from mongoengine import connect, disconnect
from .config import settings

def connect_mongoengine():
    """Create mongoengine database connection"""
    try:
        if not settings.mongodb_url:
            print("⚠️  MongoDB URL not configured, skipping mongoengine connection")
            return

        # Connect to MongoDB using mongoengine
        connect(settings.db_name, host=settings.mongodb_url)
        print(f"✅ Connected to MongoDB (mongoengine): {settings.db_name}")
        
    except Exception as e:
        print(f"⚠️  MongoEngine connection failed: {e}")
        raise e

def disconnect_mongoengine():
    """Close the mongoengine database connection"""
    disconnect()
    print("✅ MongoEngine connection closed")
