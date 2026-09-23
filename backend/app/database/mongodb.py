import logging
from typing import Optional, Any
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

try:
    from mongomock_motor import AsyncMongoMockClient
    HAS_MOCK = True
except ImportError:
    HAS_MOCK = False

logger = logging.getLogger("tsfms.database")

class DatabaseManager:
    client: Optional[Any] = None
    db: Optional[Any] = None
    is_connected: bool = False
    is_mock: bool = False

    def connect(self) -> None:
        """
        Initialize the MongoDB client.
        Enforces that MONGO_URI is configured.
        Never logs or prints the raw connection string to protect credentials.
        """
        settings.validate_config()
        
        try:
            self.client = AsyncIOMotorClient(
                settings.MONGO_URI,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000
            )
            self.db = self.client[settings.MONGO_DB_NAME]
            self.is_connected = False
            self.is_mock = False
            logger.info("MongoDB Motor client initialized for database: %s", settings.MONGO_DB_NAME)
        except Exception as e:
            logger.error("Failed to initialize MongoDB client: %s", str(e))
            raise

    async def init_connection(self) -> bool:
        """
        Verify live connection or switch to in-memory fallback if local daemon is offline.
        """
        if self.client is None:
            self.connect()

        try:
            await self.client.admin.command('ping')
            self.is_connected = True
            self.is_mock = False
            logger.info("Successfully connected to live MongoDB instance.")
            return True
        except Exception as e:
            logger.warning("Could not reach live MongoDB instance at configured URI (%s).", str(e))
            if HAS_MOCK:
                logger.info("Activating in-memory MongoDB fallback (mongomock-motor) for local testing.")
                self.client = AsyncMongoMockClient()
                self.db = self.client[settings.MONGO_DB_NAME]
                self.is_connected = True
                self.is_mock = True
                return True
            else:
                self.is_connected = False
                return False

    async def ping(self) -> bool:
        """
        Ping database to verify connectivity.
        """
        if self.client is None or self.db is None:
            return False
        if self.is_mock:
            return True
        try:
            await self.client.admin.command('ping')
            self.is_connected = True
            return True
        except Exception:
            self.is_connected = False
            return False

    def close(self) -> None:
        """
        Close connection pool on application shutdown.
        """
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.is_connected = False
            self.is_mock = False
            logger.info("MongoDB connection closed.")

db_manager = DatabaseManager()

def get_database():
    """
    Dependency to access the active MongoDB database instance.
    Collections:
      - users
      - schemes
      - applications
      - documents
      - grievances
      - audit_logs
    """
    if db_manager.db is None:
        db_manager.connect()
    return db_manager.db
