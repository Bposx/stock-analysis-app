"""
/api/comments — Community Discussions & Comments
ລະບົບຄຳຄິດເຫັນສຳລັບຫຸ້ນແຕ່ລະໂຕ ແລະ ກະດານສົນທະນາລວມ
"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import select, update
from database import AsyncSessionLocal
from models import Comment

router = APIRouter(prefix="/api/comments", tags=["Comments"])


class CreateCommentRequest(BaseModel):
    author_name: str = Field(default="ນັກລົງທຶນ", max_length=50)
    content: str = Field(..., min_length=1, max_length=1000)
    sentiment: str = Field(default="NEUTRAL")  # BULLISH | BEARISH | NEUTRAL


@router.get("/{symbol}")
async def get_comments(symbol: str, limit: int = 50):
    """ດຶງຄຳຄິດເຫັນສຳລັບ symbol (ເຊັ່ນ BCEL, AAPL, ຫຼື GENERAL)"""
    clean_sym = symbol.strip().upper().replace("LSX:", "")

    async with AsyncSessionLocal() as session:
        stmt = (
            select(Comment)
            .where(Comment.symbol == clean_sym)
            .order_by(Comment.created_at.desc())
            .limit(min(limit, 100))
        )
        result = await session.execute(stmt)
        items = result.scalars().all()

        return {
            "success": True,
            "symbol": clean_sym,
            "count": len(items),
            "data": [
                {
                    "id": c.id,
                    "symbol": c.symbol,
                    "author_name": c.author_name,
                    "content": c.content,
                    "sentiment": c.sentiment,
                    "likes": c.likes,
                    "created_at": c.created_at.isoformat(),
                }
                for c in items
            ],
        }


@router.post("/{symbol}")
async def post_comment(symbol: str, payload: CreateCommentRequest):
    """ໂພສຄຳຄິດເຫັນໃໝ່"""
    clean_sym = symbol.strip().upper().replace("LSX:", "")
    content = payload.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="Comment content cannot be empty")

    author_name = payload.author_name.strip() or "ນັກລົງທຶນ"
    sentiment = payload.sentiment.upper()
    if sentiment not in ["BULLISH", "BEARISH", "NEUTRAL"]:
        sentiment = "NEUTRAL"

    async with AsyncSessionLocal() as session:
        comment = Comment(
            symbol=clean_sym,
            author_name=author_name[:50],
            content=content[:1000],
            sentiment=sentiment,
            likes=0,
            created_at=datetime.utcnow(),
        )
        session.add(comment)
        await session.commit()
        await session.refresh(comment)

        return {
            "success": True,
            "data": {
                "id": comment.id,
                "symbol": comment.symbol,
                "author_name": comment.author_name,
                "content": comment.content,
                "sentiment": comment.sentiment,
                "likes": comment.likes,
                "created_at": comment.created_at.isoformat(),
            }
        }


@router.post("/like/{comment_id}")
async def like_comment(comment_id: int):
    """ກົດ Like ຄຳຄິດເຫັນ"""
    async with AsyncSessionLocal() as session:
        stmt = select(Comment).where(Comment.id == comment_id)
        result = await session.execute(stmt)
        comment = result.scalar_one_or_none()

        if not comment:
            raise HTTPException(status_code=404, detail="Comment not found")

        comment.likes += 1
        await session.commit()

        return {
            "success": True,
            "comment_id": comment_id,
            "likes": comment.likes,
        }
