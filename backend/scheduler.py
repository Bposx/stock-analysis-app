"""
APScheduler — Cron Jobs
ດຶງຂໍ້ມູນ LSX ທຸກ 15 ນາທີ ໂດຍອັດຕະໂນມັດ ຜ່ານ Direct REST API
"""
import logging
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from config import settings
from services.lsx_scraper import lsx_scraper
from database import AsyncSessionLocal
from models import LSXStock, LSXMarketSummary
from datetime import datetime
from sqlalchemy import select

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()


async def job_scrape_lsx_stocks():
    """Job: ດຶງລາຄາຫຸ້ນ LSX ແລ້ວ sync ລົງ DB"""
    logger.info("🔄 LSX Stock auto-sync started...")
    try:
        stocks = await lsx_scraper.scrape_all_stocks()
        if not stocks:
            return

        async with AsyncSessionLocal() as session:
            for stock_data in stocks:
                symbol = stock_data.get("symbol")
                if not symbol:
                    continue

                stmt = select(LSXStock).where(LSXStock.symbol == symbol)
                result = await session.execute(stmt)
                existing = result.scalar_one_or_none()

                if existing:
                    existing.price = stock_data.get("price")
                    existing.open = stock_data.get("open")
                    existing.high = stock_data.get("high")
                    existing.low = stock_data.get("low")
                    existing.volume = stock_data.get("volume")
                    existing.change = stock_data.get("change")
                    existing.change_pct = stock_data.get("change_pct")
                    existing.company_name = stock_data.get("company_name", existing.company_name)
                    existing.sector = stock_data.get("sector", existing.sector)
                    existing.last_updated = datetime.utcnow()
                else:
                    new_stock = LSXStock(
                        symbol=symbol,
                        company_name=stock_data.get("company_name", ""),
                        sector=stock_data.get("sector", "General"),
                        price=stock_data.get("price"),
                        open=stock_data.get("open"),
                        high=stock_data.get("high"),
                        low=stock_data.get("low"),
                        volume=stock_data.get("volume"),
                        change=stock_data.get("change"),
                        change_pct=stock_data.get("change_pct"),
                        last_updated=datetime.utcnow(),
                    )
                    session.add(new_stock)

            await session.commit()
        logger.info(f"✅ LSX stocks synced: {len(stocks)} stocks updated")
    except Exception as e:
        logger.error(f"❌ LSX stock sync failed: {e}")


async def job_scrape_lsx_market_summary():
    """Job: ດຶງ LSX Market Summary"""
    logger.info("🔄 LSX Market Summary auto-sync...")
    try:
        summary = await lsx_scraper.scrape_market_summary()
        async with AsyncSessionLocal() as session:
            entry = LSXMarketSummary(
                lsx_index=summary.get("lsx_index"),
                lsx_change=summary.get("lsx_change"),
                lsx_change_pct=summary.get("lsx_change_pct"),
                total_volume=summary.get("total_volume"),
                total_value=summary.get("total_value"),
                advances=summary.get("advances"),
                declines=summary.get("declines"),
                unchanged=summary.get("unchanged"),
                timestamp=datetime.utcnow(),
            )
            session.add(entry)
            await session.commit()
        logger.info("✅ LSX Market Summary updated")
    except Exception as e:
        logger.error(f"❌ LSX market summary sync failed: {e}")


def start_scheduler():
    interval = settings.LSX_SCRAPE_INTERVAL_MINUTES
    scheduler.add_job(
        job_scrape_lsx_stocks,
        trigger=IntervalTrigger(minutes=interval),
        id="lsx_stocks",
        name="LSX Stock Sync",
        replace_existing=True,
        max_instances=1,
    )
    scheduler.add_job(
        job_scrape_lsx_market_summary,
        trigger=IntervalTrigger(minutes=interval),
        id="lsx_market",
        name="LSX Market Summary",
        replace_existing=True,
        max_instances=1,
    )
    scheduler.start()
    logger.info(f"📅 Scheduler started — sync every {interval} minutes")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler stopped")