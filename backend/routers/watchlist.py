"""
/api/watchlist — Watchlist Management
"""
from fastapi import APIRouter, HTTPException
from sqlalchemy import select, delete
from database import AsyncSessionLocal
from models import Watchlist
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/watchlist", tags=["Watchlist"])


class WatchlistItem(BaseModel):
    symbol: str
    source: str = "yahoo"  # yahoo | lsx
    note: str = ""


@router.get("/")
async def get_watchlist():
    """ດຶງ watchlist ທັງໝົດ"""
    async with AsyncSessionLocal() as session:
        stmt = select(Watchlist).order_by(Watchlist.added_at.desc())
        result = await session.execute(stmt)
        items = result.scalars().all()
        return {
            "success": True,
            "data": [
                {
                    "id": item.id,
                    "symbol": item.symbol,
                    "source": item.source,
                    "note": item.note,
                    "added_at": item.added_at.isoformat(),
                }
                for item in items
            ],
        }


@router.post("/")
async def add_to_watchlist(item: WatchlistItem):
    """ເພີ່ມ symbol ລົງ watchlist"""
    async with AsyncSessionLocal() as session:
        # ກວດຊ້ໍາ
        stmt = select(Watchlist).where(
            Watchlist.symbol == item.symbol.upper(),
            Watchlist.source == item.source,
        )
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=409, detail=f"'{item.symbol}' already in watchlist")

        new_item = Watchlist(
            symbol=item.symbol.upper(),
            source=item.source,
            note=item.note,
        )
        session.add(new_item)
        await session.commit()
        await session.refresh(new_item)
        return {"success": True, "message": f"'{item.symbol}' added to watchlist", "id": new_item.id}


@router.delete("/{item_id}")
async def remove_from_watchlist(item_id: int):
    """ລຶບ symbol ອອກ watchlist"""
    async with AsyncSessionLocal() as session:
        stmt = delete(Watchlist).where(Watchlist.id == item_id)
        await session.execute(stmt)
        await session.commit()
        return {"success": True, "message": f"Item {item_id} removed"}
