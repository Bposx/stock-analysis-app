"""
Technical Analysis Service — Pure Python (No Pandas/Numpy Dependency)
ຄິດໄລ່ຕົວຊີ້ວັດທາງເຕັກນິກ: RSI, MACD, Bollinger Bands, Moving Averages, Stochastic
ປ້ອງກັນ C-extension segfault ແລະ Memory OOM ໃນ Server Resource ຈຳກັດ
"""
import math
from typing import Optional, List, Dict, Any


def _parse_candles(candles: list[dict]) -> list[dict]:
    """Clean, parse, and sort candles by time ascending"""
    if not candles:
        return []
    cleaned = []
    for c in candles:
        if not isinstance(c, dict):
            continue
        try:
            t = c.get("time")
            if t is None:
                continue
            if isinstance(t, str):
                t = int(float(t))
            else:
                t = int(t)

            close = float(c.get("close") or c.get("price") or 0)
            open_p = float(c.get("open") or close)
            high = float(c.get("high") or max(open_p, close))
            low = float(c.get("low") or min(open_p, close))
            vol = float(c.get("volume") or 0)

            # Skip invalid numbers
            if math.isnan(close) or math.isnan(open_p) or math.isnan(high) or math.isnan(low):
                continue

            cleaned.append({
                "time": t,
                "open": open_p,
                "high": high,
                "low": low,
                "close": close,
                "volume": vol,
            })
        except Exception:
            continue

    cleaned.sort(key=lambda x: x["time"])
    return cleaned


def calculate_rsi(candles: list[dict], period: int = 14) -> list[dict]:
    """RSI — Relative Strength Index (Wilder's Smoothing)"""
    data = _parse_candles(candles)
    if len(data) < period + 1:
        return []

    closes = [c["close"] for c in data]
    gains = [max(0.0, closes[i] - closes[i - 1]) for i in range(1, len(closes))]
    losses = [max(0.0, closes[i - 1] - closes[i]) for i in range(1, len(closes))]

    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period

    results = []
    rs = (avg_gain / avg_loss) if avg_loss > 0 else 100.0
    rsi = 100.0 - (100.0 / (1.0 + rs)) if avg_loss > 0 else 100.0
    results.append({"time": data[period]["time"], "value": round(rsi, 2)})

    for i in range(period, len(gains)):
        avg_gain = (avg_gain * (period - 1) + gains[i]) / period
        avg_loss = (avg_loss * (period - 1) + losses[i]) / period
        if avg_loss <= 0.000001:
            rsi = 100.0
        else:
            rs = avg_gain / avg_loss
            rsi = 100.0 - (100.0 / (1.0 + rs))
        results.append({"time": data[i + 1]["time"], "value": round(rsi, 2)})

    return results


def calculate_macd(
    candles: list[dict],
    fast: int = 12,
    slow: int = 26,
    signal: int = 9,
) -> dict:
    """MACD — Moving Average Convergence Divergence"""
    data = _parse_candles(candles)
    if len(data) < slow:
        return {"macd": [], "signal": [], "histogram": []}

    closes = [c["close"] for c in data]
    k_fast = 2.0 / (fast + 1)
    k_slow = 2.0 / (slow + 1)

    ema_fast = sum(closes[:fast]) / fast
    ema_slow = sum(closes[:slow]) / slow

    # Pre-roll fast EMA to match slow start
    for i in range(fast, slow - 1):
        ema_fast = (closes[i] * k_fast) + (ema_fast * (1.0 - k_fast))

    macd_vals = []
    times = []

    for i in range(slow - 1, len(closes)):
        ema_fast = (closes[i] * k_fast) + (ema_fast * (1.0 - k_fast))
        ema_slow = (closes[i] * k_slow) + (ema_slow * (1.0 - k_slow))
        macd_vals.append(ema_fast - ema_slow)
        times.append(data[i]["time"])

    if len(macd_vals) < signal:
        return {
            "macd": [{"time": times[i], "value": round(macd_vals[i], 4)} for i in range(len(macd_vals))],
            "signal": [],
            "histogram": [],
        }

    k_sig = 2.0 / (signal + 1)
    sig_ema = sum(macd_vals[:signal]) / signal

    macd_list = []
    sig_list = []
    hist_list = []

    for i in range(len(macd_vals)):
        m = macd_vals[i]
        t = times[i]
        macd_list.append({"time": t, "value": round(m, 4)})
        if i >= signal - 1:
            if i == signal - 1:
                sig_ema = sum(macd_vals[:signal]) / signal
            else:
                sig_ema = (m * k_sig) + (sig_ema * (1.0 - k_sig))
            h = m - sig_ema
            sig_list.append({"time": t, "value": round(sig_ema, 4)})
            hist_list.append({"time": t, "value": round(h, 4)})

    return {
        "macd": macd_list,
        "signal": sig_list,
        "histogram": hist_list,
    }


def calculate_bollinger_bands(
    candles: list[dict],
    period: int = 20,
    std: float = 2.0,
) -> dict:
    """Bollinger Bands — Upper, Middle (SMA), Lower"""
    data = _parse_candles(candles)
    if len(data) < period:
        return {"upper": [], "middle": [], "lower": []}

    closes = [c["close"] for c in data]
    upper = []
    middle = []
    lower = []

    for i in range(period - 1, len(closes)):
        window = closes[i - period + 1 : i + 1]
        m = sum(window) / period
        variance = sum((x - m) ** 2 for x in window) / period
        s = math.sqrt(variance)
        t = data[i]["time"]

        middle.append({"time": t, "value": round(m, 4)})
        upper.append({"time": t, "value": round(m + std * s, 4)})
        lower.append({"time": t, "value": round(m - std * s, 4)})

    return {
        "upper": upper,
        "middle": middle,
        "lower": lower,
    }


def calculate_moving_averages(
    candles: list[dict],
    periods: list[int] = [20, 50, 200],
    ma_type: str = "sma",
) -> dict:
    """Moving Averages — SMA ຫຼື EMA"""
    data = _parse_candles(candles)
    if not data:
        return {}

    closes = [c["close"] for c in data]
    result = {}
    is_ema = str(ma_type).lower() == "ema"

    for period in periods:
        key = f"ma{period}"
        if len(closes) < period:
            result[key] = []
            continue

        series = []
        if is_ema:
            k = 2.0 / (period + 1)
            ema = sum(closes[:period]) / period
            series.append({"time": data[period - 1]["time"], "value": round(ema, 4)})
            for i in range(period, len(closes)):
                ema = (closes[i] * k) + (ema * (1.0 - k))
                series.append({"time": data[i]["time"], "value": round(ema, 4)})
        else:
            window_sum = sum(closes[:period])
            series.append({"time": data[period - 1]["time"], "value": round(window_sum / period, 4)})
            for i in range(period, len(closes)):
                window_sum += closes[i] - closes[i - period]
                series.append({"time": data[i]["time"], "value": round(window_sum / period, 4)})

        result[key] = series

    return result


def calculate_stochastic(
    candles: list[dict],
    k: int = 14,
    d: int = 3,
) -> dict:
    """Stochastic Oscillator (%K, %D)"""
    data = _parse_candles(candles)
    if len(data) < k:
        return {"k": [], "d": []}

    k_list = []
    times = []
    for i in range(k - 1, len(data)):
        window = data[i - k + 1 : i + 1]
        low_min = min(c["low"] for c in window)
        high_max = max(c["high"] for c in window)
        c_price = data[i]["close"]
        diff = high_max - low_min
        fast_k = ((c_price - low_min) / diff * 100.0) if diff > 0 else 50.0
        k_list.append(fast_k)
        times.append(data[i]["time"])

    k_res = [{"time": times[i], "value": round(k_list[i], 2)} for i in range(len(k_list))]
    d_res = []
    if len(k_list) >= d:
        for i in range(d - 1, len(k_list)):
            d_val = sum(k_list[i - d + 1 : i + 1]) / d
            d_res.append({"time": times[i], "value": round(d_val, 2)})

    return {
        "k": k_res,
        "d": d_res,
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
    data = _parse_candles(candles)
    if not data or len(data) < 5:
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

    closes = [c["close"] for c in data]
    latest_close = current_price if current_price else closes[-1]

    # Moving Averages
    ma20 = (sum(closes[-20:]) / 20) if len(closes) >= 20 else None
    ma50 = (sum(closes[-50:]) / 50) if len(closes) >= 50 else None

    # RSI
    rsi_list = calculate_rsi(data, period=14)
    rsi = rsi_list[-1]["value"] if rsi_list else 50.0

    # MACD
    macd_res = calculate_macd(data)
    hist_list = macd_res.get("histogram", [])
    hist_val = hist_list[-1]["value"] if hist_list else 0.0
    macd_list = macd_res.get("macd", [])
    macd_val = macd_list[-1]["value"] if macd_list else 0.0
    sig_list = macd_res.get("signal", [])
    sig_val = sig_list[-1]["value"] if sig_list else 0.0

    # Support & Resistance (recent 20 periods)
    recent = data[-min(20, len(data)) :]
    resistance = max(c["high"] for c in recent)
    support = min(c["low"] for c in recent)
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
    bb = calculate_bollinger_bands(data, period=20)
    if bb["upper"] and bb["lower"]:
        bb_upper = bb["upper"][-1]["value"]
        bb_lower = bb["lower"][-1]["value"]
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
