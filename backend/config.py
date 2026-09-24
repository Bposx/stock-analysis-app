from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Union


class Settings(BaseSettings):
    # App
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    DEBUG: bool = True
    CORS_ORIGINS: Union[str, List[str]] = "*"

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        if isinstance(self.CORS_ORIGINS, str):
            val = self.CORS_ORIGINS.strip()
            if val.startswith("[") and val.endswith("]"):
                import json
                try:
                    return json.loads(val)
                except Exception:
                    pass
            return [i.strip() for i in val.split(",") if i.strip()]
        return ["http://localhost:5173", "http://localhost:3000"]



    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./stock_data.db"

    # API Keys
    FINNHUB_API_KEY: str = ""
    ALPHA_VANTAGE_KEY: str = ""
    POLYGON_API_KEY: str = ""

    # LSX Scraper
    LSX_BASE_URL: str = "https://www.lsx.com.la"
    LSX_SCRAPE_INTERVAL_MINUTES: int = 15
    LSX_HEADLESS: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
