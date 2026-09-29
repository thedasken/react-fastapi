import sys

from loguru import logger

from backend.core.config import settings


def configure_logging() -> None:
    logger.remove()
    logger.add(
        sys.stderr,
        level=settings.LOG_LEVEL,
        enqueue=True,
        backtrace=False,
        diagnose=False,
    )
