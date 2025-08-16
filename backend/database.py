from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os

class Database:
    client: Optional[AsyncIOMotorClient] = None

database = Database()

async def get_database() -> AsyncIOMotorClient:
    return database.client

async def connect_to_mongo():
    database.client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
    
async def close_mongo_connection():
    database.client.close()