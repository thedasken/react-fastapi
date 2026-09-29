from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi_offline import FastAPIOffline
from starlette.middleware.cors import CORSMiddleware

from backend.api.health import router as health_router
from backend.core.config import settings
from backend.core.database import dispose_database
from backend.core.logging import configure_logging, logger


configure_logging()


@asynccontextmanager
async def lifespan(_application: FastAPI) -> AsyncGenerator:
    logger.info("Application started")
    yield
    await dispose_database()
    logger.info("Application stopped")


app = FastAPIOffline(lifespan=lifespan)
app.include_router(health_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGINS_REGEX,
    allow_credentials=True,
    allow_methods=("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"),
    allow_headers=settings.CORS_HEADERS,
)
