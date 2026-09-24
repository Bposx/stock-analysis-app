"""
/api/lsx — Endpoints ສໍາລັບຫຸ້ນ LSX (Lao Securities Exchange)
"""
import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks
from sqlalchemy import select, desc
from database import AsyncSessionLocal
from models import LSXStock, LSXMarketSummary, LSXPriceHistory
from services.lsx_scraper import lsx_scraper, _get_fallback_stocks
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/lsx", tags=["LSX"])



@router.get("/market")
async def get_market_summary():
    """ດຶງ LSX Market Summary ລ່າສຸດ"""
    async with AsyncSessionLocal() as session:
        stmt = select(LSXMarketSummary).order_by(desc(LSXMarketSummary.timestamp)).limit(1)
        result = await session.execute(stmt)
        summary = result.scalar_one_or_none()

        if summary and summary.lsx_index:
            return {
                "success": True,
                "data": {
                    "lsx_index": summary.lsx_index,
                    "lsx_change": summary.lsx_change,
                    "lsx_change_pct": summary.lsx_change_pct,
                    "total_volume": summary.total_volume,
                    "total_value": summary.total_value,
                    "advances": summary.advances,
                    "declines": summary.declines,
                    "unchanged": summary.unchanged,
                    "last_updated": summary.timestamp.isoformat(),
                }
            }

    # ດຶງ Live ຈາກ API
    try:
        data = await lsx_scraper.scrape_market_summary()
        # ບັນທຶກລົງ DB
        async with AsyncSessionLocal() as session:
            entry = LSXMarketSummary(
                lsx_index=data.get("lsx_index"),
                lsx_change=data.get("lsx_change"),
                lsx_change_pct=data.get("lsx_change_pct"),
                total_volume=data.get("total_volume"),
                total_value=data.get("total_value"),
                advances=data.get("advances"),
                declines=data.get("declines"),
                unchanged=data.get("unchanged"),
            )
            session.add(entry)
            await session.commit()
        return {"success": True, "data": data, "note": "Live API"}
    except Exception as e:
        # Fallback
        return {
            "success": True,
            "data": {
                "lsx_index": 1434.40,
                "lsx_change": 7.23,
                "lsx_change_pct": 0.51,
                "total_volume": 453400,
                "total_value": 1471671000,
                "advances": 4,
                "declines": 2,
                "unchanged": 6,
                "last_updated": datetime.utcnow().isoformat(),
            }
        }


@router.get("/stocks")
async def get_all_stocks():
    """ດຶງລາຍຊື່ຫຸ້ນ LSX ທັງໝົດ — ດຶງ live ກ່ອນ, ແລ້ວ cache ລົງ DB"""
    # 1. ດຶງ live data ກ່ອນສະເໝີ
    live_data = []
    try:
        live_data = await lsx_scraper.scrape_all_stocks()
    except Exception as e:
        logger.error(f"LSX live fetch failed: {e}")

    if live_data:
        # Upsert ລົງ DB (update ຖ້າມີ, insert ຖ້າບໍ່ມີ)
        try:
            async with AsyncSessionLocal() as session:
                for item in live_data:
                    sym = item.get("symbol")
                    if not sym:
                        continue
                    # ກວດສອບວ່າມີໃນ DB ແລ້ວ
                    stmt = select(LSXStock).where(LSXStock.symbol == sym)
                    result = await session.execute(stmt)
                    existing = result.scalar_one_or_none()

                    if existing:
                        # Update ໂຕທີ່ມີຢູ່
                        existing.price = item.get("price")
                        existing.open = item.get("open")
                        existing.high = item.get("high")
                        existing.low = item.get("low")
                        existing.volume = item.get("volume")
                        existing.change = item.get("change")
                        existing.change_pct = item.get("change_pct")
                        existing.company_name = item.get("company_name", existing.company_name)
                        existing.sector = item.get("sector", existing.sector)
                        existing.last_updated = datetime.utcnow()
                    else:
                        # Insert ໃໝ່
                        session.add(LSXStock(
                            symbol=sym,
                            company_name=item.get("company_name", ""),
                            sector=item.get("sector", "General"),
                            price=item.get("price"),
                            open=item.get("open"),
                            high=item.get("high"),
                            low=item.get("low"),
                            volume=item.get("volume"),
                            change=item.get("change"),
                            change_pct=item.get("change_pct"),
                            last_updated=datetime.utcnow(),
                        ))
                await session.commit()
        except Exception as db_err:
            logger.error(f"DB upsert failed: {db_err}")

        return {"success": True, "count": len(live_data), "data": live_data, "note": "Live API"}

    # 2. ຖ້າ live fail → ດຶງຈາກ DB
    try:
        async with AsyncSessionLocal() as session:
            stmt = select(LSXStock).order_by(LSXStock.symbol)
            result = await session.execute(stmt)
            stocks = result.scalars().all()
            if stocks:
                db_data = [
                    {
                        "symbol": s.symbol,
                        "company_name": s.company_name,
                        "sector": s.sector,
                        "price": s.price,
                        "change": s.change,
                        "change_pct": s.change_pct,
                        "volume": s.volume,
                        "open": s.open,
                        "high": s.high,
                        "low": s.low,
                        "market_cap": s.market_cap,
                        "last_updated": s.last_updated.isoformat() if s.last_updated else None,
                    }
                    for s in stocks
                ]
                return {"success": True, "count": len(db_data), "data": db_data, "note": "Cached DB"}
    except Exception as db_err:
        logger.error(f"DB fetch failed: {db_err}")

    # 3. Fallback mock data ສຸດທ້າຍ
    fallback = _get_fallback_stocks()
    return {"success": True, "count": len(fallback), "data": fallback, "note": "Fallback"}


@router.get("/stocks/{symbol}")
async def get_stock_detail(symbol: str):
    """ດຶງຂໍ້ມູນຫຸ້ນ LSX ລາຍໂຕ"""
    clean_sym = symbol.replace("LSX:", "").upper().strip()

    async with AsyncSessionLocal() as session:
        stmt = select(LSXStock).where(LSXStock.symbol == clean_sym)
        result = await session.execute(stmt)
        stock = result.scalar_one_or_none()

        if stock:
            return {
                "success": True,
                "data": {
                    "symbol": stock.symbol,
                    "company_name": stock.company_name,
                    "sector": stock.sector,
                    "price": stock.price,
                    "change": stock.change,
                    "change_pct": stock.change_pct,
                    "volume": stock.volume,
                    "open": stock.open,
                    "high": stock.high,
                    "low": stock.low,
                    "market_cap": stock.market_cap,
                    "currency": "LAK",
                    "last_updated": stock.last_updated.isoformat() if stock.last_updated else None,
                }
            }

    # ດຶງ Live
    try:
        detail = await lsx_scraper.scrape_stock_detail(clean_sym)
        return {"success": True, "data": detail, "note": "Live scraped"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Stock '{clean_sym}' not found")


@router.get("/history/{symbol}")
async def get_stock_history(symbol: str):
    """ດຶງ OHLCV history ຂອງຫຸ້ນ LSX ສໍາລັບ chart (TradingView format)"""
    clean_sym = symbol.replace("LSX:", "").upper().strip()

    try:
        detail = await lsx_scraper.scrape_stock_detail(clean_sym)
        history = detail.get("history", [])
        return {"success": True, "symbol": clean_sym, "data": history}
    except Exception as e:
        return {"success": False, "symbol": clean_sym, "data": [], "error": str(e)}


@router.post("/refresh")
async def refresh_lsx_data(background_tasks: BackgroundTasks):
    """Manual trigger: ດຶງຂໍ້ມູນ LSX ໃໝ່ດ່ວນ"""
    from scheduler import job_scrape_lsx_stocks, job_scrape_lsx_market_summary
    background_tasks.add_task(job_scrape_lsx_stocks)
    background_tasks.add_task(job_scrape_lsx_market_summary)
    return {"success": True, "message": "LSX data refresh triggered in background"}