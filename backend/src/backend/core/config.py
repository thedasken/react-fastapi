from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# use the `.env` file from root directory
env_file: Path = Path(__file__).resolve().parents[4] / ".env"


class CustomBaseSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=env_file,
        env_file_encoding="utf-8",
        extra="ignore"
    )


class Config(CustomBaseSettings):
    APP_NAME: str = "React FastAPI App"
    LOG_LEVEL: str = "INFO"

    PAGINATION_DEFAULT_PAGE_SIZE: int = 10

    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 16
    DATABASE_POOL_TTL: int = 60 * 20  # 20 minutes
    DATABASE_POOL_PRE_PING: bool = True

    CORS_ORIGINS: list[str] = ["*"]
    CORS_ORIGINS_REGEX: str | None = None
    CORS_HEADERS: list[str] = ["*"]


settings = Config()  # pyright: ignore[reportCallIssue]
