"""
/api/indicators — Technical Analysis Endpoints (Yahoo Finance + LSX)
"""
from fastapi import APIRouter, HTTPException, Query
from services.yahoo_finance import get_history
from services.lsx_scraper import lsx_scraper
from services.technical_analysis import (
    calculate_rsi, calculate_macd, calculate_bollinger_bands,
    calculate_moving_averages, calculate_stochastic, calculate_all_indicators,
    analyze_stock
)
from services.yahoo_finance import get_history, get_quote
from typing import List

router = APIRouter(prefix="/api/indicators", tags=["Indicators"])

LSX_SYMBOLS = {
    "BCEL", "EDL-GEN", "EDL", "PTL", "SVN", "PCD",
    "LCTC", "MHTL", "LAT", "VCL", "LALCO", "LCS", "JDB"
}


@router.get("/analysis/{symbol}")
async def get_stock_analysis(
    symbol: str,
    period: str = Query("1y", description="History period"),
):
    """
    ວິເຄາະສິນຊັບ: ສະຫຼຸບຜົນ, ທ່າອ່ຽງໃນອະນາຄົດ, ແລະ ຄຳແນະນຳຊື້/ຂາຍ
    """
    sym = symbol.upper().strip()
    is_lsx = sym.startswith("LSX:") or sym in LSX_SYMBOLS
    clean_sym = sym.replace("LSX:", "")

    candles = []
    current_price = None
    if is_lsx:
        detail = await lsx_scraper.scrape_stock_detail(clean_sym)
        candles = detail.get("history", [])
        stocks = await lsx_scraper.scrape_all_stocks()
        match = next((s for s in stocks if s["symbol"] == clean_sym), None)
        if match:
            current_price = match.get("price")
    else:
        try:
            candles = await get_history(sym, period=period, interval="1d")
            quote_data = await get_quote(sym)
            current_price = quote_data.get("price")
        except Exception:
            pass

    if not candles:
        raise HTTPException(status_code=404, detail=f"No data for symbol '{symbol}'")

    analysis = analyze_stock(candles, current_price=current_price)
    return {"success": True, "symbol": sym, "data": analysis}


@router.get("/{symbol}")
async def get_indicators(
    symbol: str,
    period: str = "6mo",
    interval: str = "1d",
    indicators: str = "RSI,MACD,BB,MA",
    rsi_period: int = 14,
    ma_periods: str = "20,50,200",
    ma_type: str = "sma",
):
    """ຄິດໄລ່ Technical Indicators ສໍາລັບ symbol"""
    sym = symbol.upper().strip()
    is_lsx = sym.startswith("LSX:") or sym in LSX_SYMBOLS
    clean_sym = sym.replace("LSX:", "")

    # Safely extract primitive values
    p_rsi = int(getattr(rsi_period, "default", rsi_period) or 14)
    p_period = str(getattr(period, "default", period) or "6mo")
    p_interval = str(getattr(interval, "default", interval) or "1d")
    p_type = str(getattr(ma_type, "default", ma_type) or "sma")

    candles = []
    if is_lsx:
        detail = await lsx_scraper.scrape_stock_detail(clean_sym)
        candles = detail.get("history", [])
    else:
        candles = await get_history(sym, period=p_period, interval=p_interval)

    if not candles:
        raise HTTPException(status_code=404, detail=f"No data for symbol '{symbol}'")

    try:
        ind_val = indicators if isinstance(indicators, str) else getattr(indicators, "default", "RSI,MACD,BB,MA")
        if not ind_val:
            ind_val = "RSI,MACD,BB,MA"
        requested = [i.strip().upper() for i in str(ind_val).split(",") if i.strip()]
        result = {"symbol": sym, "period": p_period, "interval": p_interval}

        if "RSI" in requested:
            result["rsi"] = calculate_rsi(candles, period=p_rsi)

        if "MACD" in requested:
            result["macd"] = calculate_macd(candles)

        if "BB" in requested or "BOLLINGER" in requested:
            result["bollinger_bands"] = calculate_bollinger_bands(candles)

        if "MA" in requested or "SMA" in requested or "EMA" in requested:
            ma_val = ma_periods if isinstance(ma_periods, str) else getattr(ma_periods, "default", "20,50,200")
            periods = [int(p) for p in str(ma_val).split(",") if p.strip().isdigit()]
            result["moving_averages"] = calculate_moving_averages(candles, periods=periods, ma_type=p_type)

        if "STOCH" in requested:
            result["stochastic"] = calculate_stochastic(candles)

        if "ALL" in requested:
            result.update(calculate_all_indicators(candles))

        return {"success": True, "data": result}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))