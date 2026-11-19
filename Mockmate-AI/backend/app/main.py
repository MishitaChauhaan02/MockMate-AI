import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.database.connection import engine, SessionLocal
from app.models.base import Base
from app.database.seed_data import seed_questions

# Import routers
from app.api.routes.auth import router as auth_router
from app.api.routes.users import router as users_router
from app.api.routes.questions import router as questions_router
from app.api.routes.interviews import router as interviews_router
from app.api.routes.evaluations import router as evaluations_router
from app.api.routes.analytics import router as analytics_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("mockmate")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed questions
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as db:
        seed_questions(db)
        logger.info("Database question bank checked/seeded successfully.")
    
    yield
    # Shutdown
    logger.info("Mockmate AI backend shutting down.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Technical Interview Preparation Platform with Explainable AI Feedback",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoint
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    db_status = "healthy"
    try:
        with SessionLocal() as db:
            db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Health check DB ping failed: {e}")
        db_status = "unhealthy"

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status,
    }


# Include Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(questions_router, prefix=settings.API_V1_STR)
app.include_router(interviews_router, prefix=settings.API_V1_STR)
app.include_router(evaluations_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
