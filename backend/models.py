from sqlalchemy import String, Float, Integer, DateTime, Boolean, Text, JSON
from sqlalchemy.orm import mapped_column, Mapped
from database import Base
from datetime import datetime


class StockPrice(Base):
    """Cache ລາຄາຫຸ້ນ real-time"""
    __tablename__ = "stock_prices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(20), index=True, nullable=False)
    source: Mapped[str] = mapped_column(String(10), default="yahoo")  # yahoo | lsx
    price: Mapped[float] = mapped_column(Float, nullable=True)
    open: Mapped[float] = mapped_column(Float, nullable=True)
    high: Mapped[float] = mapped_column(Float, nullable=True)
    low: Mapped[float] = mapped_column(Float, nullable=True)
    volume: Mapped[float] = mapped_column(Float, nullable=True)
    change: Mapped[float] = mapped_column(Float, nullable=True)
    change_pct: Mapped[float] = mapped_column(Float, nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class LSXStock(Base):
    """ຂໍ້ມູນຫຸ້ນ LSX ທີ scrape ມາ"""
    __tablename__ = "lsx_stocks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    company_name: Mapped[str] = mapped_column(String(200), nullable=True)
    sector: Mapped[str] = mapped_column(String(100), nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=True)
    open: Mapped[float] = mapped_column(Float, nullable=True)
    high: Mapped[float] = mapped_column(Float, nullable=True)
    low: Mapped[float] = mapped_column(Float, nullable=True)
    volume: Mapped[float] = mapped_column(Float, nullable=True)
    change: Mapped[float] = mapped_column(Float, nullable=True)
    change_pct: Mapped[float] = mapped_column(Float, nullable=True)
    market_cap: Mapped[float] = mapped_column(Float, nullable=True)
    last_updated: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LSXPriceHistory(Base):
    """ປະຫວັດລາຄາ LSX (OHLCV)"""
    __tablename__ = "lsx_price_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(20), index=True)
    date: Mapped[str] = mapped_column(String(20), index=True)
    open: Mapped[float] = mapped_column(Float, nullable=True)
    high: Mapped[float] = mapped_column(Float, nullable=True)
    low: Mapped[float] = mapped_column(Float, nullable=True)
    close: Mapped[float] = mapped_column(Float, nullable=True)
    volume: Mapped[float] = mapped_column(Float, nullable=True)


class Watchlist(Base):
    """Watchlist ຂອງຜູ້ໃຊ້"""
    __tablename__ = "watchlist"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    source: Mapped[str] = mapped_column(String(10), default="yahoo")  # yahoo | lsx
    note: Mapped[str] = mapped_column(String(500), nullable=True)
    added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class LSXMarketSummary(Base):
    """LSX Market Index Summary"""
    __tablename__ = "lsx_market_summary"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lsx_index: Mapped[float] = mapped_column(Float, nullable=True)
    lsx_change: Mapped[float] = mapped_column(Float, nullable=True)
    lsx_change_pct: Mapped[float] = mapped_column(Float, nullable=True)
    total_volume: Mapped[float] = mapped_column(Float, nullable=True)
    total_value: Mapped[float] = mapped_column(Float, nullable=True)
    advances: Mapped[int] = mapped_column(Integer, nullable=True)
    declines: Mapped[int] = mapped_column(Integer, nullable=True)
    unchanged: Mapped[int] = mapped_column(Integer, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class VisitorLog(Base):
    """ບັນທຶກການເຂົ້າຊົມເວັບໄຊ"""
    __tablename__ = "visitor_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page: Mapped[str] = mapped_column(String(200), default="/", index=True)
    visitor_id: Mapped[str] = mapped_column(String(100), index=True, nullable=True)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str] = mapped_column(String(300), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class Comment(Base):
    """ຄຳຄິດເຫັນຂອງຜູ້ເຂົ້າຊົມ (ແຍກຕາມຫຸ້ນ ຫຼື ທົ່ວໄປ)"""
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    symbol: Mapped[str] = mapped_column(String(50), index=True, default="GENERAL")
    author_name: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    sentiment: Mapped[str] = mapped_column(String(20), default="NEUTRAL")  # BULLISH | BEARISH | NEUTRAL
    likes: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

