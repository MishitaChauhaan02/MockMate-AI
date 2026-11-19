
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    PROJECT_NAME: str = "Mockmate AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # Environment
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./mockmate.db"

    # Security
    # No insecure default secret. Must be configured in .env.
    SECRET_KEY: str = Field(min_length=32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # AI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"

    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    def get_cors_origins(self) -> List[str]:
        origins = list(self.ALLOWED_ORIGINS)

        if self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)

        return origins


settings = Settings()
