"""
Stock Analysis App — FastAPI Backend
ຈຸດເລີ່ມຕົ້ນ: uvicorn main:app --reload
"""
import logging
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from config import settings
from database import init_db
from scheduler import start_scheduler, stop_scheduler
from routers import stocks, lsx, indicators, watchlist

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup + Shutdown events"""
    logger.info("🚀 Starting Stock Analysis API...")

    # Init Database
    await init_db()
    logger.info("✅ Database initialized")

    # Start background scheduler (LSX scraping)
    start_scheduler()

    # Trigger first LSX sync immediately
    from scheduler import job_scrape_lsx_stocks, job_scrape_lsx_market_summary
    asyncio.create_task(job_scrape_lsx_stocks())
    asyncio.create_task(job_scrape_lsx_market_summary())

    yield  # App running...

    # Shutdown
    stop_scheduler()
    logger.info("👋 Shutting down...")


app = FastAPI(
    title="Stock Analysis API",
    description="ລະບົບວິເຄາະຫຸ້ນ LSX + ຕ່າງປະເທດ",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — ອະນຸຍາດ Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Mount Routers
app.include_router(stocks.router)
app.include_router(lsx.router)
app.include_router(indicators.router)
app.include_router(watchlist.router)


@app.get("/")
async def root():
    return {
        "app": "Stock Analysis API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "foreign_stocks": "/api/stocks",
            "lsx_stocks": "/api/lsx",
            "indicators": "/api/indicators",
            "watchlist": "/api/watchlist",
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": __import__("datetime").datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.DEBUG,
        log_level="info",
    )
