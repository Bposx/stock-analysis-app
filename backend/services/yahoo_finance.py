"""
Yahoo Finance Service
ດຶງຂໍ້ມູນຫຸ້ນຕ່າງປະເທດ: US, Thai (.BK), Crypto (-USD), ຯລຯ
"""
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Optional
import asyncio
from functools import lru_cache


def _get_ticker(symbol: str) -> yf.Ticker:
    return yf.Ticker(symbol)


async def get_quote(symbol: str) -> dict:
    """ດຶງລາຄາ real-time ສໍາລັບ symbol ໃດໜຶ່ງ ພ້ອມ Fallback ທີ່ແຂງແກ່ນ"""
    loop = asyncio.get_event_loop()

    def _fetch():
        ticker = _get_ticker(symbol)
        price = None
        open_price = None
        high = None
        low = None
        vol = None
        prev_close = None
        currency = "USD"
        mkt_cap = None

        # 1. ລອງໃຊ້ fast_info
        try:
            info = ticker.fast_info
            price = getattr(info, "last_price", None)
            open_price = getattr(info, "open", None)
            high = getattr(info, "day_high", None)
            low = getattr(info, "day_low", None)
            vol = getattr(info, "last_volume", None)
            prev_close = getattr(info, "previous_close", None)
            currency = getattr(info, "currency", "USD")
            mkt_cap = getattr(info, "market_cap", None)
        except Exception:
            pass

        # 2. ຖ້າ fast_info ບໍ່ໄດ້ ຫຼື ເກີດ KeyError, ໃຊ້ history(period="5d") ແທນ
        if price is None:
            try:
                hist = ticker.history(period="5d")
                if not hist.empty:
                    last_row = hist.iloc[-1]
                    price = float(last_row["Close"])
                    open_price = float(last_row["Open"])
                    high = float(last_row["High"])
                    low = float(last_row["Low"])
                    vol = float(last_row["Volume"])
                    if len(hist) > 1:
                        prev_close = float(hist.iloc[-2]["Close"])
                    else:
                        prev_close = open_price
            except Exception:
                pass

        if price is None:
            return {
                "symbol": symbol.upper(),
                "price": None,
                "open": None,
                "high": None,
                "low": None,
                "volume": None,
                "previous_close": None,
                "change": 0.0,
                "change_pct": 0.0,
                "currency": currency or "USD",
                "market_cap": None,
                "timestamp": datetime.utcnow().isoformat(),
            }

        change = (price or 0) - (prev_close or price or 0)
        change_pct = (change / (prev_close or price or 1)) * 100

        return {
            "symbol": symbol.upper(),
            "price": round(price, 2) if price else None,
            "open": round(open_price, 2) if open_price else None,
            "high": round(high, 2) if high else None,
            "low": round(low, 2) if low else None,
            "volume": vol,
            "previous_close": round(prev_close, 2) if prev_close else None,
            "change": round(change, 2),
            "change_pct": round(change_pct, 2),
            "currency": currency or "USD",
            "market_cap": mkt_cap,
            "timestamp": datetime.utcnow().isoformat(),
        }

    return await loop.run_in_executor(None, _fetch)


async def get_history(
    symbol: str,
    period: str = "1mo",
    interval: str = "1d"
) -> list[dict]:
    """
    ດຶງ OHLCV history ສໍາລັບ chart
    period: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max
    interval: 1m, 5m, 15m, 1h, 1d, 1wk, 1mo
    """
    loop = asyncio.get_event_loop()

    def _fetch():
        ticker = _get_ticker(symbol)
        df = ticker.history(period=period, interval=interval)
        if df.empty:
            return []
        df.index = pd.to_datetime(df.index)
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

    return await loop.run_in_executor(None, _fetch)


async def get_company_info(symbol: str) -> dict:
    """ດຶງຂໍ້ມູນບໍລິສັດ, ປະຫວັດ, ສິນຊັບ, ເງິນປັນຜົນ ແລະ ຄ່າຄອງຕົວ"""
    loop = asyncio.get_event_loop()

    def _fetch():
        ticker = _get_ticker(symbol)
        info = ticker.info or {}
        
        # 1. ດຶງປະຫວັດການຈ່າຍປັນຜົນ (Dividend History)
        dividend_history = []
        try:
            divs = ticker.dividends
            if divs is not None and not divs.empty:
                tail_divs = divs.tail(8)
                for dt, amt in tail_divs.items():
                    date_str = str(dt)[:10]
                    dividend_history.append({
                        "date": date_str,
                        "amount": round(float(amt), 4),
                    })
                dividend_history.reverse()  # ໃໝ່ສຸດຂຶ້ນກ່ອນ
        except Exception:
            pass

        # 2. ຄາດຄະເນປີສ້າງຕັ້ງຖ້າບໍ່ມີ field ຕົງ
        founded_year = info.get("founded")
        if not founded_year and info.get("longBusinessSummary"):
            import re
            m = re.search(r'(?:founded|incorporated|organized|established) in (\d{4})', info["longBusinessSummary"], re.IGNORECASE)
            if m:
                founded_year = m.group(1)

        return {
            "symbol": symbol.upper(),
            "name": info.get("longName") or info.get("shortName", symbol),
            "sector": info.get("sector", ""),
            "industry": info.get("industry", ""),
            "country": info.get("country", ""),
            "city": info.get("city", ""),
            "state": info.get("state", ""),
            "website": info.get("website", ""),
            "description": info.get("longBusinessSummary", ""),
            "employees": info.get("fullTimeEmployees"),
            "founded": founded_year,
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

    return await loop.run_in_executor(None, _fetch)


async def search_stocks(query: str, limit: int = 20) -> list[dict]:
    """
    ຄົ້ນຫາ stock symbols
    ໃຊ້ yfinance search (v0.2.43+)
    """
    loop = asyncio.get_event_loop()

    def _fetch():
        results = []
        try:
            # yfinance Search
            search = yf.Search(query, max_results=limit)
            quotes = search.quotes
            for q in quotes:
                results.append({
                    "symbol": q.get("symbol", ""),
                    "name": q.get("shortname") or q.get("longname", ""),
                    "exchange": q.get("exchange", ""),
                    "type": q.get("quoteType", "EQUITY"),
                    "currency": q.get("currency", ""),
                })
        except Exception:
            pass
        return results

    return await loop.run_in_executor(None, _fetch)


async def get_multiple_quotes(symbols: list[str]) -> list[dict]:
    """ດຶງລາຄາຫຼາຍ symbols ພ້ອມກັນ"""
    tasks = [get_quote(sym) for sym in symbols]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return [r for r in results if isinstance(r, dict) and r.get("price") is not None]
