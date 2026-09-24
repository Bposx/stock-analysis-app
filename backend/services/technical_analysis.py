"""
Technical Analysis Service
ຄິດໄລ່ຕົວຊີ້ວັດທາງເຕັກນິກດ້ວຍ Pure Pandas & Numpy
(RSI, MACD, Bollinger Bands, Moving Averages, Stochastic)
"""
import pandas as pd
import numpy as np
from typing import Optional


def _to_df(candles: list[dict]) -> pd.DataFrame:
    """ແປງ OHLCV list -> DataFrame"""
    if not candles:
        return pd.DataFrame()
    df = pd.DataFrame(candles)
    df["time"] = pd.to_datetime(df["time"], unit="s")
    df.set_index("time", inplace=True)
    df.sort_index(inplace=True)
    for col in ["open", "high", "low", "close", "volume"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def calculate_rsi(candles: list[dict], period: int = 14) -> list[dict]:
    """RSI — Relative Strength Index (Wilder's RSI)"""
    df = _to_df(candles)
    if df.empty or "close" not in df.columns or len(df) < period:
        return []

    close_delta = df["close"].diff()
    up = close_delta.clip(lower=0)
    down = -1 * close_delta.clip(upper=0)

    # Wilder's Smoothing / Exponential moving average
    ma_up = up.ewm(com=period - 1, adjust=False, min_periods=period).mean()
    ma_down = down.ewm(com=period - 1, adjust=False, min_periods=period).mean()

    rs = ma_up / ma_down
    rsi = 100 - (100 / (1 + rs))

    result = []
    for ts, val in rsi.items():
        if pd.notna(val):
            result.append({
                "time": int(ts.timestamp()),
                "value": round(float(val), 2),
            })
    return result


def calculate_macd(
    candles: list[dict],
    fast: int = 12,
    slow: int = 26,
    signal: int = 9
) -> dict:
    """MACD — Moving Average Convergence Divergence"""
    df = _to_df(candles)
    if df.empty or "close" not in df.columns or len(df) < slow:
        return {"macd": [], "signal": [], "histogram": []}

    exp_fast = df["close"].ewm(span=fast, adjust=False).mean()
    exp_slow = df["close"].ewm(span=slow, adjust=False).mean()
    macd_line = exp_fast - exp_slow
    signal_line = macd_line.ewm(span=signal, adjust=False).mean()
    histogram = macd_line - signal_line

    def _series_to_list(series):
        return [
            {"time": int(ts.timestamp()), "value": round(float(val), 4)}
            for ts, val in series.items()
            if pd.notna(val)
        ]

    return {
        "macd": _series_to_list(macd_line),
        "signal": _series_to_list(signal_line),
        "histogram": _series_to_list(histogram),
    }


def calculate_bollinger_bands(
    candles: list[dict],
    period: int = 20,
    std: float = 2.0
) -> dict:
    """Bollinger Bands — Upper, Middle (SMA), Lower"""
    df = _to_df(candles)
    if df.empty or "close" not in df.columns or len(df) < period:
        return {"upper": [], "middle": [], "lower": []}

    middle = df["close"].rolling(window=period).mean()
    rolling_std = df["close"].rolling(window=period).std()
    upper = middle + (rolling_std * std)
    lower = middle - (rolling_std * std)

    def _series_to_list(series):
        return [
            {"time": int(ts.timestamp()), "value": round(float(val), 4)}
            for ts, val in series.items()
            if pd.notna(val)
        ]

    return {
        "upper": _series_to_list(upper),
        "middle": _series_to_list(middle),
        "lower": _series_to_list(lower),
    }


def calculate_moving_averages(
    candles: list[dict],
    periods: list[int] = [20, 50, 200],
    ma_type: str = "sma"
) -> dict:
    """Moving Averages — SMA ຫຼື EMA"""
    df = _to_df(candles)
    if df.empty or "close" not in df.columns:
        return {}

    result = {}
    for period in periods:
        if ma_type.lower() == "ema":
            series = df["close"].ewm(span=period, adjust=False).mean()
        else:
            series = df["close"].rolling(window=period).mean()

        key = f"ma{period}"
        result[key] = [
            {"time": int(ts.timestamp()), "value": round(float(val), 4)}
            for ts, val in series.items()
            if pd.notna(val)
        ]

    return result


def calculate_stochastic(
    candles: list[dict],
    k: int = 14,
    d: int = 3
) -> dict:
    """Stochastic Oscillator (%K, %D)"""
    df = _to_df(candles)
    if df.empty or len(df) < k:
        return {"k": [], "d": []}

    low_min = df["low"].rolling(window=k).min()
    high_max = df["high"].rolling(window=k).max()

    fast_k = 100 * ((df["close"] - low_min) / (high_max - low_min))
    fast_d = fast_k.rolling(window=d).mean()

    def _to_list(s):
        return [
            {"time": int(ts.timestamp()), "value": round(float(v), 2)}
            for ts, v in s.items()
            if pd.notna(v)
        ]

    return {
        "k": _to_list(fast_k),
        "d": _to_list(fast_d),
    }


def calculate_all_indicators(candles: list[dict]) -> dict:
    """ຄິດໄລ່ indicator ທັງໝົດໃນຄັ້ງດຽວ"""
    return {
        "rsi": calculate_rsi(candles),
        "macd": calculate_macd(candles),
        "bollinger_bands": calculate_bollinger_bands(candles),
        "moving_averages": calculate_moving_averages(candles),
        "stochastic": calculate_stochastic(candles),
    }


def analyze_stock(candles: list[dict], current_price: Optional[float] = None) -> dict:
    """
    ວິເຄາະສິນຊັບລະອຽດ: ສະຫຼຸບຜົນການວິເຄາະ, ຄາດຄະເນອະນາຄົດ, ແລະ ຄຳແນະນຳຊື້/ຂາຍ
    """
    if not candles or len(candles) < 5:
        return {
            "signal": "NEUTRAL",
            "action_label": "ຂໍ້ມູນຍັງບໍ່ພຽງພໍ (Insufficient Data)",
            "action_color": "gray",
            "can_buy": False,
            "can_sell": False,
            "score": 50,
            "trend": "ບໍ່ສາມາດລະບຸໄດ້",
            "current_price": current_price or 0,
            "support": current_price or 0,
            "resistance": current_price or 0,
            "stop_loss": current_price or 0,
            "take_profit": current_price or 0,
            "summary_text": "ຍັງມີຂໍ້ມູນປະຫວັດລາຄາບໍ່ພຽງພໍສໍາລັບການວິເຄາະເຕັກນິກ.",
            "outlook_text": "ຕ້ອງການຂໍ້ມູນເພີ່ມເຕີມເພື່ອປະເມີນທ່າອ່ຽງໃນອະນາຄົດ.",
            "recommendation_text": "ແນະນຳໃຫ້ລໍຖ້າໃຫ້ມີຂໍ້ມູນການຊື້ຂາຍເພີ່ມຕື່ມກ່ອນຕັດສິນໃຈ.",
            "breakdown": [],
        }

    df = _to_df(candles)
    latest_close = current_price if current_price else float(df["close"].iloc[-1])

    # Moving Averages
    ma20 = float(df["close"].rolling(20).mean().iloc[-1]) if len(df) >= 20 else None
    ma50 = float(df["close"].rolling(50).mean().iloc[-1]) if len(df) >= 50 else None

    # RSI (14)
    delta = df["close"].diff()
    up = delta.clip(lower=0)
    down = -1 * delta.clip(upper=0)
    ma_up = up.ewm(com=13, adjust=False).mean()
    ma_down = down.ewm(com=13, adjust=False).mean()
    rs = ma_up / ma_down
    rsi_series = 100 - (100 / (1 + rs))
    rsi = float(rsi_series.iloc[-1]) if pd.notna(rsi_series.iloc[-1]) else 50.0

    # MACD
    fast = df["close"].ewm(span=12, adjust=False).mean()
    slow = df["close"].ewm(span=26, adjust=False).mean()
    macd_line = fast - slow
    sig_line = macd_line.ewm(span=9, adjust=False).mean()
    hist = macd_line - sig_line
    macd_val = float(macd_line.iloc[-1])
    sig_val = float(sig_line.iloc[-1])
    hist_val = float(hist.iloc[-1])

    # Support & Resistance (recent 20 periods)
    recent = df.tail(min(20, len(df)))
    resistance = float(recent["high"].max())
    support = float(recent["low"].min())
    if resistance <= support:
        resistance = round(latest_close * 1.05, 2)
        support = round(latest_close * 0.95, 2)

    # Scoring (0 - 100)
    score = 50
    breakdown = []

    # 1. Trend Analysis
    if ma20:
        if latest_close > ma20:
            score += 15
            trend_str = "ຂາຂຶ້ນ (Uptrend)"
            breakdown.append({
                "name": "ເສັ້ນສະເລ່ຍ MA20",
                "signal": "BUY",
                "status": "ລາຄາຢືນເໜືອເສັ້ນສະເລ່ຍ",
                "desc": f"ລາຄາປັດຈຸບັນ ({latest_close:,.2f}) ຢູ່ສູງກວ່າເສັ້ນ MA20 ({ma20:,.2f}) ສະແດງທ່າອ່ຽງຂາຂຶ້ນໄລຍະສັ້ນ"
            })
        else:
            score -= 15
            trend_str = "ຂາລົງ (Downtrend)"
            breakdown.append({
                "name": "ເສັ້ນສະເລ່ຍ MA20",
                "signal": "SELL",
                "status": "ລາຄາຫຼຸດລົງໃຕ້ເສັ້ນສະເລ່ຍ",
                "desc": f"ລາຄາປັດຈຸບັນ ({latest_close:,.2f}) ຢູ່ຕ່ຳກວ່າເສັ້ນ MA20 ({ma20:,.2f}) ສະແດງແຮງກົດດັນຂາລົງ"
            })
    else:
        trend_str = "ແກວ່ງໂຕ (Sideways)"

    # 2. RSI Analysis
    if rsi < 30:
        score += 20
        breakdown.append({
            "name": "RSI (14)",
            "signal": "STRONG_BUY",
            "status": f"Oversold ({rsi:.1f})",
            "desc": "ມີການເທຂາຍຫຼາຍເກີນໄປ ຈົນລາຄາຫຼຸດລົງເຂດຕ່ຳສຸດ ມີໂອກາດຟື້ນໂຕຂຶ້ນຢ່າງໄວວາ"
        })
    elif rsi > 70:
        score -= 20
        breakdown.append({
            "name": "RSI (14)",
            "signal": "SELL",
            "status": f"Overbought ({rsi:.1f})",
            "desc": "ມີການຊື້ຫຼາຍເກີນໄປ ລາຄາຂຶ້ນມາສູງແລ້ວ ອາດມີແຮງເທຂາຍເຮັດກຳໄລໃນໄວໆນີ້"
        })
    elif rsi >= 50:
        score += 8
        breakdown.append({
            "name": "RSI (14)",
            "signal": "BUY",
            "status": f"Bullish Zone ({rsi:.1f})",
            "desc": "RSI ຢູ່ເໜືອລະດັບ 50 ສະແດງວ່າແຮງຊື້ຍັງມີປຽບຫຼາຍກວ່າແຮງຂາຍ"
        })
    else:
        score -= 8
        breakdown.append({
            "name": "RSI (14)",
            "signal": "SELL",
            "status": f"Bearish Zone ({rsi:.1f})",
            "desc": "RSI ຕ່ຳກວ່າ 50 ສະແດງວ່າແຮງຂາຍເລີ່ມເຂົ້າມາກົດດັນລາຄາ"
        })

    # 3. MACD Analysis
    if macd_val > sig_val and hist_val > 0:
        score += 15
        breakdown.append({
            "name": "MACD (12, 26, 9)",
            "signal": "BUY",
            "status": "Golden Cross (ຕັດຂຶ້ນ)",
            "desc": "ເສັ້ນ MACD ຕັດເສັ້ນ Signal ຂຶ້ນ ເປັນສັນຍານແຮງສົ່ງຂາຂຶ້ນທີ່ຊັດເຈນ"
        })
    elif macd_val < sig_val and hist_val < 0:
        score -= 15
        breakdown.append({
            "name": "MACD (12, 26, 9)",
            "signal": "SELL",
            "status": "Death Cross (ຕັດລົງ)",
            "desc": "ເສັ້ນ MACD ຕັດເສັ້ນ Signal ລົງ ເປັນສັນຍານເຕືອນໃຫ້ລະວັງແຮງເທຂາຍ"
        })
    else:
        breakdown.append({
            "name": "MACD (12, 26, 9)",
            "signal": "NEUTRAL",
            "status": "ແກວ່ງໂຕໃນກອບ",
            "desc": "MACD ແລະ Signal ກຳລັງເຄື່ອນທີ່ຕິດກັນ ລໍຖ້າທິດທາງທີ່ແນ່ນອນ"
        })

    # 4. Bollinger Bands position
    bb_mid = df["close"].rolling(20).mean().iloc[-1] if len(df) >= 20 else latest_close
    bb_std = df["close"].rolling(20).std().iloc[-1] if len(df) >= 20 else 0
    bb_lower = bb_mid - (bb_std * 2) if bb_std else latest_close * 0.95
    bb_upper = bb_mid + (bb_std * 2) if bb_std else latest_close * 1.05

    if latest_close <= bb_lower * 1.02:
        score += 10
        breakdown.append({
            "name": "Bollinger Bands",
            "signal": "BUY",
            "status": "ໃກ້ຂອບລຸ່ມ (Support)",
            "desc": "ລາຄາລົງມາໃກ້ເສັ້ນຂອບລຸ່ມຂອງ Bollinger Bands ເຊິ່ງເປັນແນວຮັບທີ່ມີໂອກາດດີດໂຕຂຶ້ນ"
        })
    elif latest_close >= bb_upper * 0.98:
        score -= 10
        breakdown.append({
            "name": "Bollinger Bands",
            "signal": "SELL",
            "status": "ໃກ້ຂອບເທິງ (Resistance)",
            "desc": "ລາຄາຂຶ້ນມາຕິດເສັ້ນຂອບເທິງຂອງ Bollinger Bands ອາດຕິດແນວຕ້ານ ແລະ ຊະລໍໂຕ"
        })

    score = max(5, min(95, score))

    # Signal determination
    if score >= 75:
        signal = "STRONG_BUY"
        action_label = "ແນະນຳໃຫ້ຊື້ແຮງ (Strong Buy)"
        action_color = "green"
        can_buy = True
        can_sell = False
        recom_text = "ສັນຍານເຕັກນິກຫຼາຍຕົວຊີ້ວັດເປັນບວກພ້ອມກັນ! ແຮງຊື້ຄຸມຕະຫຼາດຢ່າງຊັດເຈນ ສາມາດພິຈາລະນາເຂົ້າຊື້ ຫຼື ເພີ່ມນ້ຳໜັກການລົງທຶນໄດ້."
    elif score >= 58:
        signal = "BUY"
        action_label = "ແນະນຳໃຫ້ຊື້ (Buy)"
        action_color = "green"
        can_buy = True
        can_sell = False
        recom_text = "ທ່າອ່ຽງລາຄາມີແຮງຊື້ສະໜັບສະໜູນ ສາມາດຊື້ສະສົມໄດ້ ໂດຍວາງຈຸດ Stop Loss ໄວ້ຕໍ່າກວ່າແນວຮັບເພື່ອປ້ອງກັນຄວາມສ່ຽງ."
    elif score >= 42:
        signal = "HOLD"
        action_label = "ຖືໄວ້ / ລໍຖ້າຈັງຫວະ (Hold / Neutral)"
        action_color = "yellow"
        can_buy = False
        can_sell = False
        recom_text = "ຕະຫຼາດກຳລັງແກວ່ງໂຕເລືອກຂ້າງ ຍັງບໍ່ມີສັນຍານຊັດເຈນ. ຜູ້ທີ່ມີຫຸ້ນແນະນຳໃຫ້ຖືຕໍ່, ຜູ້ທີ່ຍັງບໍ່ມີໃຫ້ລໍຖ້າຈັງຫວະຍໍ່ຕົວລົງໃກ້ແນວຮັບກ່ອນເຂົ້າຊື້."
    elif score >= 25:
        signal = "SELL"
        action_label = "ແນະນຳໃຫ້ຂາຍ (Sell)"
        action_color = "red"
        can_buy = False
        can_sell = True
        recom_text = "ສັນຍານເຕັກນິກອ່ອນກຳລັງ ມີຄວາມສ່ຽງທີ່ລາຄາຈະປັບຖານລົງຕໍ່ ຄວນພິຈາລະນາຂາຍເຮັດກຳໄລ ຫຼື ຫຼຸດຄວາມສ່ຽງ."
    else:
        signal = "STRONG_SELL"
        action_label = "ແນະນຳໃຫ້ຂາຍດ່ວນ (Strong Sell)"
        action_color = "red"
        can_buy = False
        can_sell = True
        recom_text = "ທ່າອ່ຽງຂາລົງຮຸນແຮງ ແລະ ຫຼຸດເສັ້ນສະເລ່ຍສຳຄັນ ບໍ່ຄວນເຂົ້າຊື້ຢ່າງເດັດຂາດ ແລະ ຄວນຕັດຂາດທຶນ (Stop Loss) ຖ້າກຳລັງຖືຢູ່."

    # Future Outlook
    if score >= 60:
        outlook_text = f"ໃນໄລຍະສັ້ນ 1-2 ອາທິດໜ້າ ຄາດວ່າລາຄາມີໂອກາດທົດສອບແນວຕ້ານຖັດໄປທີ່ {resistance:,.2f}. ຖ້າຜ່ານແນວຕ້ານນີ້ໄດ້ ຈະເປັນການເປີດຊ່ອງວ່າງຂາຂຶ້ນຮອບໃໝ່."
    elif score <= 40:
        outlook_text = f"ໃນໄລຍະສັ້ນ 1-2 ອາທິດໜ້າ ລາຄາມີຄວາມສ່ຽງທີ່ຈະຖອຍລົງທົດສອບແນວຮັບທີ່ {support:,.2f}. ຖ້າຫຼຸດແນວຮັບນີ້ ອາດເກີດແຮງເທຂາຍເພີ່ມຕື່ມ."
    else:
        outlook_text = f"ຄາດວ່າລາຄາຈະແກວ່ງໂຕໃນກອບ (Sideways) ລະຫວ່າງແນວຮັບ {support:,.2f} ຫາ ແນວຕ້ານ {resistance:,.2f} ເພື່ອສ້າງຖານລາຄາໃໝ່ກ່ອນເລືອກທິດທາງ."

    stop_loss = round(support * 0.97, 2)
    take_profit = round(resistance * 1.05, 2)

    return {
        "signal": signal,
        "action_label": action_label,
        "action_color": action_color,
        "can_buy": can_buy,
        "can_sell": can_sell,
        "score": score,
        "trend": trend_str,
        "current_price": latest_close,
        "support": support,
        "resistance": resistance,
        "stop_loss": stop_loss,
        "take_profit": take_profit,
        "summary_text": f"ສິນຊັບນີ້ປະຈຸບັນຢູ່ໃນທ່າອ່ຽງ {trend_str} ດ້ວຍຄະແນນເຕັກນິກ {score}/100. RSI ຢູ່ທີ່ {rsi:.1f} ແລະ MACD ໃຫ້ສັນຍານ {'ບວກ' if hist_val > 0 else 'ລົບ'}.",
        "outlook_text": outlook_text,
        "recommendation_text": recom_text,
        "breakdown": breakdown,
    }

