"""
Application configuration settings
"""
import os
from typing import List
from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    app_name: str = "SiLab API"
    app_version: str = "1.0.0"
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Database
    mongodb_url: str = os.getenv("MONGODB_URL", "")
    db_name: str = os.getenv("DB_NAME", "silab")
    
    # CORS
    frontend_origins: str = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000,http://localhost:3001")
    
    # R2R Service
    r2r_base_url: str = os.getenv("R2R_BASE_URL", "http://localhost:7272")
    
    # Server
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    
    @property
    def allowed_origins(self) -> List[str]:
        """Parse CORS origins from environment"""
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]
    
    class Config:
        env_file = ".env"

settings = Settings()