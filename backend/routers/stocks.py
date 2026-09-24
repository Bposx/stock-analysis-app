"""
/api/stocks — Endpoints ສໍາລັບຫຸ້ນຕ່າງປະເທດ (Yahoo Finance) + LSX fallback
"""
from fastapi import APIRouter, HTTPException, Query
from services.yahoo_finance import get_quote, get_history, get_company_info, search_stocks, get_multiple_quotes
from services.lsx_scraper import lsx_scraper
from typing import Optional

router = APIRouter(prefix="/api/stocks", tags=["Stocks"])

POPULAR_SYMBOLS = {
    "us": ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "SPY", "QQQ"],
    "thai": ["PTT.BK", "AOT.BK", "CPALL.BK", "DELTA.BK", "BDMS.BK", "GULF.BK", "KBANK.BK", "SCB.BK"],
    "vietnam": ["VCB.VN", "VNM.VN", "VIC.VN", "VHM.VN", "HPG.VN", "FPT.VN", "TCB.VN", "MSN.VN"],
    "china": ["600519.SS", "002594.SZ", "300750.SZ", "601398.SS", "601857.SS", "BABA", "PDD", "000858.SZ"],
    "japan": ["7203.T", "6758.T", "9984.T", "7974.T", "8035.T", "6861.T", "8306.T", "9432.T"],
    "crypto": ["BTC-USD", "ETH-USD", "BNB-USD", "SOL-USD", "XRP-USD", "ADA-USD"],
    "indices": ["^GSPC", "^NDX", "^DJI", "^SET.BK", "VNM", "000001.SS", "^N225"],
    "commodities": ["GC=F", "CL=F"],
}

MARKET_CATEGORIES = {
    "us": {
        "title": "US Stocks",
        "indices": ["^GSPC", "^IXIC", "^DJI"],
        "symbols": [
            "AAPL", "MSFT", "NVDA", "AMZN", "GOOGL", "META", "TSLA",
            "AMD", "NFLX", "PLTR", "SPY", "QQQ", "DIA", "BRK-B",
            "JPM", "V", "WMT", "DIS", "COIN", "INTC"
        ],
    },
    "thai": {
        "title": "Thai Stocks (SET)",
        "indices": ["^SET.BK"],
        "symbols": [
            "PTT.BK", "AOT.BK", "CPALL.BK", "DELTA.BK", "BDMS.BK", "GULF.BK",
            "ADVANC.BK", "KBANK.BK", "SCB.BK", "SCC.BK", "BBL.BK", "TRUE.BK",
            "PTTEP.BK", "KTB.BK", "CPN.BK", "CRC.BK", "MINT.BK", "BANPU.BK",
            "WHA.BK", "BH.BK"
        ],
    },
    "vietnam": {
        "title": "Vietnam Stocks (HOSE / HNX)",
        "indices": ["VNM"],
        "symbols": [
            "VCB.VN", "VNM.VN", "VIC.VN", "VHM.VN", "HPG.VN", "FPT.VN",
            "TCB.VN", "MSN.VN", "BID.VN", "GAS.VN", "SSI.VN", "MWG.VN",
            "VRE.VN", "MBB.VN", "HDB.VN", "VPB.VN", "SAB.VN", "PLX.VN",
            "BVH.VN", "VJC.VN"
        ],
    },
    "china": {
        "title": "China Stocks (A-Shares & Tech)",
        "indices": ["000001.SS"],
        "symbols": [
            "600519.SS", "002594.SZ", "300750.SZ", "601398.SS", "601857.SS",
            "601288.SS", "000858.SZ", "000333.SZ", "BABA", "PDD",
            "TCEHY", "600036.SS", "601988.SS", "600900.SS", "002475.SZ",
            "601088.SS", "600030.SS", "601318.SS"
        ],
    },
    "japan": {
        "title": "Japan Stocks (Tokyo Stock Exchange / TSE)",
        "indices": ["^N225"],
        "symbols": [
            "7203.T", "6758.T", "9984.T", "7974.T", "8035.T",
            "6861.T", "8306.T", "9432.T", "6501.T", "7267.T",
            "6902.T", "9983.T", "4063.T", "8001.T", "8058.T",
            "4502.T", "6367.T", "6981.T"
        ],
    },
    "other": {
        "title": "Other Assets & Crypto",
        "crypto": ["BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD", "DOGE-USD", "ADA-USD", "AVAX-USD"],
        "commodities": ["GC=F", "CL=F", "SI=F"],
        "indices": ["^N225", "^HSI", "^FTSE", "^GDAXI"],
        "symbols": [
            "BTC-USD", "ETH-USD", "SOL-USD", "BNB-USD", "XRP-USD", "DOGE-USD",
            "GC=F", "CL=F", "SI=F",
            "^N225", "^HSI", "^FTSE", "^GDAXI"
        ],
    },
}

LSX_SYMBOLS = {
    "BCEL", "EDL-GEN", "EDL", "PTL", "SVN", "PCD",
    "LCTC", "MHTL", "LAT", "VCL", "LALCO", "LCS", "JDB"
}


@router.get("/quote/{symbol}")
async def quote(symbol: str):
    """ດຶງລາຄາ real-time (Yahoo Finance ຫຼື LSX)"""
    sym = symbol.upper().strip()
    is_lsx = sym.startswith("LSX:") or sym in LSX_SYMBOLS
    clean_sym = sym.replace("LSX:", "")

    if is_lsx:
        try:
            stocks = await lsx_scraper.scrape_all_stocks()
            match = next((s for s in stocks if s["symbol"] == clean_sym), None)
            if match:
                return {
                    "success": True,
                    "data": {
                        "symbol": f"LSX:{clean_sym}",
                        "price": match.get("price"),
                        "open": match.get("open"),
                        "high": match.get("high"),
                        "low": match.get("low"),
                        "volume": match.get("volume"),
                        "previous_close": (match.get("price") or 0) - (match.get("change") or 0),
                        "change": match.get("change"),
                        "change_pct": match.get("change_pct"),
                        "currency": "LAK",
                        "market_cap": None,
                        "timestamp": match.get("last_updated"),
                    }
                }
        except Exception:
            pass

    try:
        data = await get_quote(sym)
        if data.get("price") is None:
            raise HTTPException(status_code=404, detail=f"Symbol '{symbol}' not found")
        return {"success": True, "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{symbol}")
async def history(
    symbol: str,
    period: str = Query("1mo", description="1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, max"),
    interval: str = Query("1d", description="1m, 5m, 15m, 1h, 1d, 1wk, 1mo"),
):
    """ດຶງ OHLCV history ສໍາລັບ chart (TradingView format)"""
    sym = symbol.upper().strip()
    is_lsx = sym.startswith("LSX:") or sym in LSX_SYMBOLS
    clean_sym = sym.replace("LSX:", "")

    if is_lsx:
        try:
            detail = await lsx_scraper.scrape_stock_detail(clean_sym)
            hist = detail.get("history", [])
            if hist:
                return {"success": True, "symbol": sym, "period": period, "interval": interval, "data": hist}
        except Exception:
            pass

    valid_combos = {
        "1d": ["1m", "5m", "15m", "1h"],
        "5d": ["5m", "15m", "1h", "1d"],
        "1mo": ["1h", "1d"],
        "3mo": ["1d"],
        "6mo": ["1d", "1wk"],
        "1y": ["1d", "1wk"],
        "2y": ["1d", "1wk", "1mo"],
        "5y": ["1d", "1wk", "1mo"],
        "max": ["1mo"],
    }
    if period not in valid_combos:
        raise HTTPException(status_code=400, detail=f"Invalid period. Use: {list(valid_combos.keys())}")

    try:
        data = await get_history(sym, period=period, interval=interval)
        return {"success": True, "symbol": sym, "period": period, "interval": interval, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/info/{symbol}")
async def company_info(symbol: str):
    """ດຶງຂໍ້ມູນບໍລິສັດ"""
    sym = symbol.upper().strip()
    is_lsx = sym.startswith("LSX:") or sym in LSX_SYMBOLS
    clean_sym = sym.replace("LSX:", "")

    if is_lsx:
        company_map = await lsx_scraper.get_issue_list()
        comp = company_map.get(clean_sym, {})
        return {
            "success": True,
            "data": {
                "symbol": f"LSX:{clean_sym}",
                "name": comp.get("name_en") or comp.get("name_lao") or clean_sym,
                "sector": "Lao Securities Exchange",
                "industry": "Securities",
                "country": "Laos",
                "website": "http://lsx.com.la",
                "description": f"{comp.get('name_lao', '')} ({comp.get('name_en', '')}) - ຈົດທະບຽນໃນຕະຫຼາດຫຼັກຊັບລາວ (LSX)",
                "employees": None,
                "pe_ratio": None,
                "pb_ratio": None,
                "dividend_yield": None,
                "52w_high": None,
                "52w_low": None,
                "avg_volume": None,
                "market_cap": None,
            }
        }

    try:
        data = await get_company_info(sym)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search")
async def search(
    q: str = Query(..., min_length=1, description="Stock symbol or company name"),
    limit: int = Query(20, ge=1, le=50),
):
    """ຄົ້ນຫາ stock symbols (ລວມທັງ LSX)"""
    query_upper = q.upper().strip()
    results = []

    # 1. ກວດສອບ LSX stocks
    company_map = await lsx_scraper.get_issue_list()
    for sym, comp in company_map.items():
        if query_upper in sym or query_upper in comp.get("name_en", "").upper() or query_upper in comp.get("name_lao", "").upper():
            results.append({
                "symbol": f"LSX:{sym}",
                "name": comp.get("name_en") or comp.get("name_lao", ""),
                "exchange": "LSX",
                "type": "EQUITY",
                "currency": "LAK",
            })

    # 2. ຄົ້ນຫາ Yahoo Finance
    try:
        yf_results = await search_stocks(q, limit=limit)
        results.extend(yf_results)
    except Exception:
        pass

    return {"success": True, "query": q, "results": results[:limit]}


@router.post("/quotes")
async def multiple_quotes(symbols: list[str]):
    if len(symbols) > 30:
        raise HTTPException(status_code=400, detail="Maximum 30 symbols per request")
    try:
        data = await get_multiple_quotes([s.upper() for s in symbols])
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/popular")
async def popular():
    all_symbols = [s for group in POPULAR_SYMBOLS.values() for s in group]
    try:
        data = await get_multiple_quotes(all_symbols)
        return {"success": True, "categories": POPULAR_SYMBOLS, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/category/{category}")
async def get_by_category(category: str):
    cat = category.lower().strip()
    if cat not in MARKET_CATEGORIES:
        raise HTTPException(
            status_code=404,
            detail=f"Category '{category}' not found. Valid: {list(MARKET_CATEGORIES.keys())}"
        )
    config = MARKET_CATEGORIES[cat]
    syms = config.get("symbols", [])
    indices_syms = config.get("indices", [])
    all_syms = list(dict.fromkeys(indices_syms + syms))
    try:
        data = await get_multiple_quotes(all_syms)
        return {
            "success": True,
            "category": cat,
            "info": config,
            "data": data,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))