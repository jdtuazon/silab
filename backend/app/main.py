"""
SiLab Backend API - Main Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
from app.services.r2r_service import r2r_service
from app.routers import health, test_data, rag, compliance

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    
    # Connect to MongoDB
    await connect_to_mongo()
    
    # Check R2R service health
    try:
        health = await r2r_service.health_check()
        if health.get("status") == "ok":
            print("✅ R2R service is healthy and ready")
        else:
            print("⚠️  R2R service health check failed:", health.get("message"))
    except Exception as e:
        print(f"⚠️  R2R service startup check failed: {e}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down application")
    await close_mongo_connection()
    await r2r_service.close()

def create_application() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="SiLab Backend API for compliance analysis and document processing",
        lifespan=lifespan
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(health.router)
    app.include_router(test_data.router)
    app.include_router(rag.router)
    app.include_router(compliance.router)
    
    return app

# Create application instance
app = create_application()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "status": "running"
    }