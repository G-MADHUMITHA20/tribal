import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.mongodb import db_manager, get_database
from app.services.application_service import seed_schemes_if_empty

# Routers
from app.routes.auth import router as auth_router
from app.routes.schemes import router as schemes_router
from app.routes.applications import router as applications_router
from app.routes.documents import router as documents_router
from app.routes.grievances import router as grievances_router

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("tsfms.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager: connects to MongoDB on startup and cleans up on shutdown.
    """
    logger.info("Initializing MoTA TSFMS Backend Service...")
    try:
        is_connected = await db_manager.init_connection()
        if is_connected and db_manager.db is not None:
            await seed_schemes_if_empty(db_manager.db)
            logger.info("MongoDB initialized and scheme seed data ensured.")
        else:
            logger.warning("MongoDB ping failed. Running with database disconnected status.")
    except Exception as e:
        logger.error("Startup database connection warning: %s", str(e))

    yield

    logger.info("Shutting down MoTA TSFMS Backend Service...")
    db_manager.close()

# FastAPI application initialization
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "Unified AI-Enabled Scholarship & Fellowship Management System (TSFMS) "
        "Ministry of Tribal Affairs, Government of India. "
        "Provides authentication, scheme discovery, application journeys, document metadata, "
        "and grievance handling."
    ),
    version="1.0.0",
    docs_url="/docs",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Configuration (Restricted strictly to configured frontend origins, avoiding wildcard)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health Check Endpoints
@app.get("/api/health", tags=["System Health"], summary="Service Health Check")
async def health_check():
    """
    Basic system liveness probe.
    """
    return {"status": "ok"}

@app.get("/api/health/db", tags=["System Health"], summary="Database Connectivity Check")
async def health_db_check():
    """
    Verify active MongoDB cluster connectivity.
    """
    is_live = await db_manager.ping()
    if not is_live:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "database": settings.MONGO_DB_NAME,
                "message": "MongoDB is currently unreachable. Check MONGO_URI configuration in backend/.env."
            }
        )
    return {
        "status": "connected",
        "database": settings.MONGO_DB_NAME,
        "mode": "in_memory_simulation" if db_manager.is_mock else "live_cluster",
        "message": "In-memory MongoDB simulation active (configure MONGO_URI in .env for live cluster)" if db_manager.is_mock else "MongoDB connection established and verified."
    }

# Register Sub-Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(schemes_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(grievances_router, prefix=settings.API_V1_STR)
