"""
SiLab Backend - Backward Compatibility Entry Point
This file maintains backward compatibility with the old structure.
For new development, use: python main_new.py or uvicorn app.main:app
"""
import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    print("⚠️  Using legacy entry point. Consider using 'python main_new.py' for new structure.")
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )