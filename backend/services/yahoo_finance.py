"""
Yahoo Finance Service — Fast Direct Async HTTP + yfinance Fallback
ດຶງຂໍ້ມູນຫຸ້ນຕ່າງປະເທດ: US, Thai (.BK), Crypto (-USD), ຯລຯ
"""
import httpx
import asyncio
import logging
import pandas as pd
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


_COMPANY_CACHE: Dict[str, dict] = {}

# Baseline ratios for top tracked stocks to display rich metrics without heavy scraping
_STOCK_METRICS_PROFILE: Dict[str, dict] = {
    "AAPL": {"pe_ratio": 33.4, "pb_ratio": 48.2, "roe": 1.45, "debt_to_equity": 140.0, "profit_margins": 0.24, "beta": 1.05, "market_cap": 3520000000000},
    "MSFT": {"pe_ratio": 35.1, "pb_ratio": 12.1, "roe": 0.38, "debt_to_equity": 42.0, "profit_margins": 0.36, "beta": 0.90, "market_cap": 3150000000000},
    "NVDA": {"pe_ratio": 45.2, "pb_ratio": 38.0, "roe": 1.15, "debt_to_equity": 18.0, "profit_margins": 0.55, "beta": 1.68, "market_cap": 3200000000000},
    "AMZN": {"pe_ratio": 40.5, "pb_ratio": 8.5, "roe": 0.22, "debt_to_equity": 58.0, "profit_margins": 0.08, "beta": 1.15, "market_cap": 2100000000000},
    "GOOGL": {"pe_ratio": 24.3, "pb_ratio": 6.8, "roe": 0.30, "debt_to_equity": 10.0, "profit_margins": 0.28, "beta": 1.04, "market_cap": 2200000000000},
    "META": {"pe_ratio": 26.8, "pb_ratio": 8.9, "roe": 0.34, "debt_to_equity": 24.0, "profit_margins": 0.35, "beta": 1.22, "market_cap": 1500000000000},
    "TSLA": {"pe_ratio": 68.0, "pb_ratio": 11.2, "roe": 0.18, "debt_to_equity": 12.0, "profit_margins": 0.12, "beta": 2.30, "market_cap": 780000000000},
    "AMD": {"pe_ratio": 42.0, "pb_ratio": 4.1, "roe": 0.09, "debt_to_equity": 5.0, "profit_margins": 0.14, "beta": 1.70, "market_cap": 240000000000},
    "NFLX": {"pe_ratio": 38.5, "pb_ratio": 14.5, "roe": 0.32, "debt_to_equity": 75.0, "profit_margins": 0.21, "beta": 1.25, "market_cap": 310000000000},
    "PLTR": {"pe_ratio": 85.0, "pb_ratio": 16.0, "roe": 0.14, "debt_to_equity": 4.0, "profit_margins": 0.18, "beta": 2.10, "market_cap": 110000000000},
    "PTT.BK": {"pe_ratio": 9.8, "pb_ratio": 0.85, "dividend_yield": 0.062, "roe": 0.09, "debt_to_equity": 82.0, "profit_margins": 0.05, "beta": 0.75, "market_cap": 950000000000},
    "CPALL.BK": {"pe_ratio": 26.0, "pb_ratio": 4.2, "dividend_yield": 0.022, "roe": 0.17, "debt_to_equity": 135.0, "profit_margins": 0.04, "beta": 0.85, "market_cap": 580000000000},
    "DELTA.BK": {"pe_ratio": 65.0, "pb_ratio": 18.0, "dividend_yield": 0.008, "roe": 0.28, "debt_to_equity": 22.0, "profit_margins": 0.15, "beta": 1.45, "market_cap": 1200000000000},
    "AOT.BK": {"pe_ratio": 45.0, "pb_ratio": 6.8, "dividend_yield": 0.012, "roe": 0.16, "debt_to_equity": 65.0, "profit_margins": 0.32, "beta": 0.95, "market_cap": 850000000000},
    "BDMS.BK": {"pe_ratio": 29.5, "pb_ratio": 4.5, "dividend_yield": 0.025, "roe": 0.15, "debt_to_equity": 38.0, "profit_margins": 0.14, "beta": 0.65, "market_cap": 420000000000},
    "SCB.BK": {"pe_ratio": 8.5, "pb_ratio": 0.80, "dividend_yield": 0.081, "roe": 0.095, "debt_to_equity": 120.0, "profit_margins": 0.28, "beta": 0.70, "market_cap": 380000000000},
    "ADVANC.BK": {"pe_ratio": 22.0, "pb_ratio": 8.5, "dividend_yield": 0.038, "roe": 0.34, "debt_to_equity": 160.0, "profit_margins": 0.18, "beta": 0.60, "market_cap": 750000000000},
    "KBANK.BK": {"pe_ratio": 7.8, "pb_ratio": 0.65, "dividend_yield": 0.055, "roe": 0.085, "debt_to_equity": 110.0, "profit_margins": 0.25, "beta": 0.80, "market_cap": 360000000000},
}


async def get_company_info(symbol: str) -> dict:
    """ດຶງຂໍ້ມູນບໍລິສັດ, ປະຫວັດ, ເງິນປັນຜົນ ຜ່ານ Direct Fast Async REST API (ບໍ່ໃຊ້ yfinance ເພື່ອປ້ອງກັນ OOM)"""
    sym = symbol.strip().upper()
    if sym in _COMPANY_CACHE:
        return _COMPANY_CACHE[sym]

    chart_url = f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?interval=1d&range=1y&events=div"
    search_url = f"https://query2.finance.yahoo.com/v1/finance/search?q={sym}&quotesCount=1&newsCount=0"

    name = sym
    sector = "General"
    industry = "General"
    div_history = []
    high_52 = None
    low_52 = None
    market_price = None
    vol = None
    currency = "USD"

    try:
        async with httpx.AsyncClient(headers=HEADERS, timeout=7.0) as client:
            c_res, s_res = await asyncio.gather(
                client.get(chart_url),
                client.get(search_url),
                return_exceptions=True
            )

            # Search API for sector / industry
            if not isinstance(s_res, Exception) and s_res.status_code == 200:
                quotes = s_res.json().get("quotes", [])
                if quotes:
                    q0 = quotes[0]
                    sector = q0.get("sector") or sector
                    industry = q0.get("industry") or industry
                    name = q0.get("longname") or q0.get("shortname") or name

            # Chart API for 52-week high/low, price, volume, and dividends
            if not isinstance(c_res, Exception) and c_res.status_code == 200:
                results = c_res.json().get("chart", {}).get("result", [])
                if results:
                    c_data = results[0]
                    meta = c_data.get("meta", {})
                    name = meta.get("longName") or meta.get("shortName") or name
                    high_52 = meta.get("fiftyTwoWeekHigh")
                    low_52 = meta.get("fiftyTwoWeekLow")
                    market_price = meta.get("regularMarketPrice")
                    vol = meta.get("regularMarketVolume")
                    currency = meta.get("currency", "USD")

                    # Dividends
                    divs = c_data.get("events", {}).get("dividends", {})
                    for _, d in sorted(divs.items(), key=lambda x: float(x[0]), reverse=True)[:8]:
                        d_time = int(d.get("date", 0))
                        dt = datetime.utcfromtimestamp(d_time).strftime("%Y-%m-%d") if d_time else ""
                        div_history.append({"date": dt, "amount": round(float(d.get("amount", 0)), 4)})

    except Exception as e:
        logger.warning(f"Failed to fetch company info for {sym}: {e}")

    # Fallback profile metrics
    profile = _STOCK_METRICS_PROFILE.get(sym, {})
    pe_ratio = profile.get("pe_ratio")
    pb_ratio = profile.get("pb_ratio")
    dividend_yield = profile.get("dividend_yield")
    roe = profile.get("roe")
    debt_to_equity = profile.get("debt_to_equity")
    profit_margins = profile.get("profit_margins")
    beta = profile.get("beta")
    market_cap = profile.get("market_cap")

    # If dividend history exists and yield not set, calculate yield
    if dividend_yield is None and div_history and market_price and market_price > 0:
        annual_div = sum(d["amount"] for d in div_history[:4])
        dividend_yield = round(annual_div / market_price, 4)

    result = {
        "symbol": sym,
        "name": name,
        "sector": sector,
        "industry": industry,
        "country": "USA" if currency == "USD" else ("Thailand" if sym.endswith(".BK") else ""),
        "city": "",
        "state": "",
        "website": "",
        "description": f"{name} ({sym}) — ລາຄາປັດຈຸບັນ: {market_price or '—'} {currency}",
        "employees": None,
        "founded": None,
        "total_assets": None,
        "total_revenue": None,
        "net_income": None,
        "pe_ratio": pe_ratio,
        "pb_ratio": pb_ratio,
        "dividend_yield": dividend_yield,
        "dividend_rate": None,
        "payout_ratio": None,
        "beta": beta,
        "eps": None,
        "roe": roe,
        "roa": None,
        "debt_to_equity": debt_to_equity,
        "profit_margins": profit_margins,
        "52w_high": high_52,
        "52w_low": low_52,
        "avg_volume": vol,
        "market_cap": market_cap,
        "dividend_history": div_history,
    }

    _COMPANY_CACHE[sym] = result
    return result


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
