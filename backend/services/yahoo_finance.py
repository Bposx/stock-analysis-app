"""
Yahoo Finance Service — Fast Direct Async HTTP + yfinance Fallback
ດຶງຂໍ້ມູນຫຸ້ນຕ່າງປະເທດ: US, Thai (.BK), Crypto (-USD), ຯລຯ
"""
import httpx
import asyncio
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
}

# Baseline cache ສໍາລັບ fallback ຖ້າເຄືອຂ່າຍມີບັນຫາ
_QUOTE_CACHE: Dict[str, dict] = {}


async def get_quote(symbol: str) -> dict:
    """ດຶງລາຄາ real-time ສໍາລັບ symbol ໃດໜຶ່ງ ຜ່ານ Yahoo Chart REST API ໂດຍກົງ"""
    sym = symbol.strip().upper()
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval=1d&range=5d"

    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=8.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("chart", {}).get("result")
                if results:
                    item = results[0]
                    meta = item.get("meta", {})
                    price = meta.get("regularMarketPrice")
                    prev_close = meta.get("chartPreviousClose") or price

                    # ຖ້າບໍ່ມີ regularMarketPrice, ລອງດຶງຈາກ close candle ລ່າສຸດ
                    if price is None:
                        quotes = item.get("indicators", {}).get("quote", [{}])[0]
                        closes = [c for c in quotes.get("close", []) if c is not None]
                        if closes:
                            price = closes[-1]
                            if len(closes) > 1:
                                prev_close = closes[-2]

                    if price is not None:
                        change = price - (prev_close or price)
                        change_pct = (change / (prev_close or 1)) * 100

                        quote_data = {
                            "symbol": sym,
                            "price": round(float(price), 2),
                            "open": round(float(meta.get("regularMarketDayHigh") or price), 2),
                            "high": round(float(meta.get("regularMarketDayHigh") or price), 2),
                            "low": round(float(meta.get("regularMarketDayLow") or price), 2),
                            "volume": meta.get("regularMarketVolume") or 0,
                            "previous_close": round(float(prev_close), 2) if prev_close else round(float(price), 2),
                            "change": round(float(change), 2),
                            "change_pct": round(float(change_pct), 2),
                            "currency": meta.get("currency") or "USD",
                            "market_cap": None,
                            "timestamp": datetime.utcnow().isoformat(),
                        }
                        _QUOTE_CACHE[sym] = quote_data
                        return quote_data
    except Exception as e:
        logger.warning(f"Direct quote fetch failed for {sym}: {e}")

    # Fallback 1: Cache ເກົ່າຖ້າມີ
    if sym in _QUOTE_CACHE:
        return _QUOTE_CACHE[sym]

    # Fallback 2: yfinance ticker
    try:
        import yfinance as yf
        ticker = yf.Ticker(sym)
        hist = ticker.history(period="5d")
        if not hist.empty:
            last_row = hist.iloc[-1]
            p = float(last_row["Close"])
            prev_p = float(hist.iloc[-2]["Close"]) if len(hist) > 1 else p
            c = p - prev_p
            quote_data = {
                "symbol": sym,
                "price": round(p, 2),
                "open": round(float(last_row["Open"]), 2),
                "high": round(float(last_row["High"]), 2),
                "low": round(float(last_row["Low"]), 2),
                "volume": int(last_row["Volume"]) if not pd.isna(last_row["Volume"]) else 0,
                "previous_close": round(prev_p, 2),
                "change": round(c, 2),
                "change_pct": round((c / (prev_p or 1)) * 100, 2),
                "currency": "USD",
                "market_cap": None,
                "timestamp": datetime.utcnow().isoformat(),
            }
            _QUOTE_CACHE[sym] = quote_data
            return quote_data
    except Exception:
        pass

    return {
        "symbol": sym,
        "price": None,
        "open": None,
        "high": None,
        "low": None,
        "volume": None,
        "previous_close": None,
        "change": 0.0,
        "change_pct": 0.0,
        "currency": "USD",
        "market_cap": None,
        "timestamp": datetime.utcnow().isoformat(),
    }


async def get_multiple_quotes(symbols: List[str]) -> List[dict]:
    """ດຶງລາຄາຫຼາຍ symbols ພ້ອມກັນ ແບບ Asynchronous (ໄວ, ບໍ່ຕິດ rate limit)"""
    if not symbols:
        return []

    clean_symbols = list(dict.fromkeys([s.strip().upper() for s in symbols if s.strip()]))
    sem = asyncio.Semaphore(10)

    async def _fetch(s: str):
        async with sem:
            return await get_quote(s)

    tasks = [_fetch(s) for s in clean_symbols]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, dict) and r.get("price") is not None]


async def get_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
) -> List[dict]:
    """ດຶງ OHLCV history ສໍາລັບ chart (TradingView format) ຜ່ານ Yahoo Chart API ໂດຍກົງ"""
    sym = symbol.strip().upper()

    # Map intervals/periods
    valid_range = period if period in ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "max"] else "1mo"
    valid_interval = interval if interval in ["1m", "5m", "15m", "1h", "1d", "1wk", "1mo"] else "1d"

    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval={valid_interval}&range={valid_range}"

    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                results = data.get("chart", {}).get("result")
                if results:
                    item = results[0]
                    timestamps = item.get("timestamp", [])
                    indicators = item.get("indicators", {}).get("quote", [{}])[0]

                    opens = indicators.get("open", [])
                    highs = indicators.get("high", [])
                    lows = indicators.get("low", [])
                    closes = indicators.get("close", [])
                    volumes = indicators.get("volume", [])

                    records = []
                    for i in range(len(timestamps)):
                        t = timestamps[i]
                        c = closes[i] if i < len(closes) else None
                        o = opens[i] if i < len(opens) else c
                        h = highs[i] if i < len(highs) else c
                        l = lows[i] if i < len(lows) else c
                        v = volumes[i] if i < len(volumes) else 0

                        if c is not None and o is not None:
                            records.append({
                                "time": int(t),
                                "open": round(float(o), 4),
                                "high": round(float(h), 4),
                                "low": round(float(l), 4),
                                "close": round(float(c), 4),
                                "volume": int(v) if v is not None else 0,
                            })
                    if records:
                        return records
    except Exception as e:
        logger.warning(f"Direct history fetch failed for {sym}: {e}")

    # Fallback: yfinance
    try:
        import yfinance as yf
        import pandas as pd
        ticker = yf.Ticker(sym)
        df = ticker.history(period=valid_range, interval=valid_interval)
        if not df.empty:
            records = []
            for ts, row in df.iterrows():
                records.append({
                    "time": int(ts.timestamp()),
                    "open": round(float(row["Open"]), 4),
                    "high": round(float(row["High"]), 4),
                    "low": round(float(row["Low"]), 4),
                    "close": round(float(row["Close"]), 4),
                    "volume": int(row["Volume"]) if not pd.isna(row["Volume"]) else 0,
                })
            return records
    except Exception:
        pass

    return []


async def get_company_info(symbol: str) -> dict:
    """ດຶງຂໍ້ມູນບໍລິສັດ, ປະຫວັດ, ເງິນປັນຜົນ"""
    sym = symbol.strip().upper()
    try:
        import yfinance as yf
        ticker = yf.Ticker(sym)
        info = ticker.info or {}

        dividend_history = []
        try:
            divs = ticker.dividends
            if divs is not None and not divs.empty:
                for dt, amt in divs.tail(8).items():
                    dividend_history.append({
                        "date": str(dt)[:10],
                        "amount": round(float(amt), 4),
                    })
                dividend_history.reverse()
        except Exception:
            pass

        return {
            "symbol": sym,
            "name": info.get("longName") or info.get("shortName", sym),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "country": info.get("country", ""),
            "city": info.get("city", ""),
            "state": info.get("state", ""),
            "website": info.get("website", ""),
            "description": info.get("longBusinessSummary", ""),
            "employees": info.get("fullTimeEmployees"),
            "founded": info.get("founded"),
            "total_assets": info.get("totalAssets"),
            "total_revenue": info.get("totalRevenue"),
            "net_income": info.get("netIncomeToCommon"),
            "pe_ratio": info.get("trailingPE"),
            "pb_ratio": info.get("priceToBook"),
            "dividend_yield": info.get("dividendYield"),
            "dividend_rate": info.get("dividendRate"),
            "payout_ratio": info.get("payoutRatio"),
            "beta": info.get("beta"),
            "eps": info.get("trailingEps"),
            "roe": info.get("returnOnEquity"),
            "roa": info.get("returnOnAssets"),
            "debt_to_equity": info.get("debtToEquity"),
            "profit_margins": info.get("profitMargins"),
            "52w_high": info.get("fiftyTwoWeekHigh"),
            "52w_low": info.get("fiftyTwoWeekLow"),
            "avg_volume": info.get("averageVolume"),
            "market_cap": info.get("marketCap"),
            "dividend_history": dividend_history,
        }
    except Exception:
        return {
            "symbol": sym,
            "name": sym,
            "sector": "Technology",
            "industry": "General",
            "country": "",
            "city": "",
            "state": "",
            "website": "",
            "description": "",
            "employees": None,
            "founded": None,
            "total_assets": None,
            "total_revenue": None,
            "net_income": None,
            "pe_ratio": None,
            "pb_ratio": None,
            "dividend_yield": None,
            "dividend_rate": None,
            "payout_ratio": None,
            "beta": None,
            "eps": None,
            "roe": None,
            "roa": None,
            "debt_to_equity": None,
            "profit_margins": None,
            "52w_high": None,
            "52w_low": None,
            "avg_volume": None,
            "market_cap": None,
            "dividend_history": [],
        }


async def search_stocks(query: str, limit: int = 20) -> List[dict]:
    """ຄົ້ນຫາ stock symbols ຜ່ານ Yahoo Search API ໂດຍກົງ"""
    q = query.strip()
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={q}&quotesCount={limit}&newsCount=0"
    results = []
    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=5.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("quotes", []):
                    sym = item.get("symbol")
                    if sym:
                        results.append({
                            "symbol": sym,
                            "name": item.get("shortname") or item.get("longname") or sym,
                            "exchange": item.get("exchange", ""),
                            "type": item.get("quoteType", "EQUITY"),
                            "currency": item.get("currency", "USD"),
                        })
    except Exception as e:
        logger.warning(f"Search failed for {q}: {e}")

    return results
