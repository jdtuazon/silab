"""
Health check endpoints
"""
from fastapi import APIRouter
from app.core.database import get_database
from app.core.config import settings

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "app_name": settings.app_name,
        "version": settings.app_version
    }

@router.get("/database")
async def database_health():
    """Database health check"""
    try:
        db = get_database()
        if not db:
            return {"status": "unhealthy", "error": "Database not connected"}
            
        # Test database connection
        collections = await db.list_collection_names()
        return {
            "status": "healthy",
            "database": settings.db_name,
            "collections": collections
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}