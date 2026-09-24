import { useEffect, useRef, useState, useMemo } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
} from "lightweight-charts";
import { useHistory, useIndicators } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const PERIODS = [
  { label: "1D", period: "1d", interval: "5m" },
  { label: "5D", period: "5d", interval: "15m" },
  { label: "1M", period: "1mo", interval: "1h" },
  { label: "3M", period: "3mo", interval: "1d" },
  { label: "6M", period: "6mo", interval: "1d" },
  { label: "1Y", period: "1y", interval: "1d" },
  { label: "5Y", period: "5y", interval: "1wk" },
];

interface Props {
  symbol: string;
  currency?: string;
}

// Ensure data is sorted strictly ascending by timestamp and has no duplicates or NaN values
function sanitizeSeriesData<T extends { time: number | string }>(data: T[] | undefined | null): T[] {
  if (!data || !Array.isArray(data) || data.length === 0) return [];
  const map = new Map<number, T>();
  for (const item of data) {
    if (item && item.time != null) {
      const t = typeof item.time === "number" ? item.time : Math.floor(new Date(item.time).getTime() / 1000);
      if (!isNaN(t)) {
        map.set(t, { ...item, time: t as any });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.time as number) - (b.time as number));
}

export default function StockChart({ symbol }: Props) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const rsiRef = useRef<HTMLDivElement>(null);
  const macdRef = useRef<HTMLDivElement>(null);

  const chartInstanceRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const macdChartRef = useRef<IChartApi | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[2]); // Default 1M
  const [showMA, setShowMA] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [chartError, setChartError] = useState<string | null>(null);

  // Period / interval synchronization
  const histPeriod = selectedPeriod.period;
  const histInterval = selectedPeriod.interval;
  const indPeriod = selectedPeriod.period === "1d" ? "1mo" : selectedPeriod.period;
  const indInterval = selectedPeriod.period === "1d" ? "1d" : selectedPeriod.interval;

  const { data: rawCandles, isLoading, isError } = useHistory(symbol, histPeriod, histInterval);
  const { data: indicators } = useIndicators(symbol, indPeriod, indInterval);

  // Sanitize candles data
  const candles = useMemo(() => {
    const sanitized = sanitizeSeriesData(rawCandles);
    return sanitized.filter(
      (c: any) =>
        c &&
        !isNaN(c.open) &&
        !isNaN(c.high) &&
        !isNaN(c.low) &&
        !isNaN(c.close) &&
        c.open != null &&
        c.high != null &&
        c.low != null &&
        c.close != null
    );
  }, [rawCandles]);

  const isDark = theme === "dark";
  const CHART_THEME = useMemo(
    () => ({
      layout: {
        background: { type: ColorType.Solid, color: isDark ? "#1a1d27" : "#ffffff" },
        textColor: isDark ? "#9ca3af" : "#64748b",
      },
      grid: {
        vertLines: { color: isDark ? "#2d3048" : "#f1f5f9" },
        horzLines: { color: isDark ? "#2d3048" : "#f1f5f9" },
      },
      crosshair: {
        vertLine: { color: isDark ? "#6b7280" : "#94a3b8" },
        horzLine: { color: isDark ? "#6b7280" : "#94a3b8" },
      },
      timeScale: {
        borderColor: isDark ? "#2d3048" : "#e2e8f0",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: isDark ? "#2d3048" : "#e2e8f0",
      },
    }),
    [isDark]
  );

  useEffect(() => {
    setChartError(null);

    // If container not ready or no candles, cleanup and wait
    if (!chartRef.current || !candles.length) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
      if (macdChartRef.current) {
        macdChartRef.current.remove();
        macdChartRef.current = null;
      }
      return;
    }

    try {
      // 1. Destroy old instances
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
      if (macdChartRef.current) {
        macdChartRef.current.remove();
        macdChartRef.current = null;
      }

      // Clear container DOM
      if (chartRef.current) chartRef.current.innerHTML = "";
      if (rsiRef.current) rsiRef.current.innerHTML = "";
      if (macdRef.current) macdRef.current.innerHTML = "";

      // 2. Create Main Candlestick Chart
      const chart = createChart(chartRef.current, {
        ...CHART_THEME,
        width: chartRef.current.clientWidth || 800,
        height: 380,
      });
      chartInstanceRef.current = chart;

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderUpColor: "#26a69a",
        borderDownColor: "#ef5350",
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      candleSeries.setData(candles as any);

      // 3. Moving Averages Overlay
      if (showMA && indicators?.moving_averages) {
        const maColors: Record<string, string> = { ma20: "#2196f3", ma50: "#ff9800", ma200: "#e91e63" };
        Object.entries(indicators.moving_averages).forEach(([key, data]) => {
          const sanitizedMA = sanitizeSeriesData(data as any);
          if (sanitizedMA.length > 0) {
            const maSeries = chart.addLineSeries({
              color: maColors[key] || "#9e9e9e",
              lineWidth: 1,
              title: key.toUpperCase(),
              lastValueVisible: true,
              priceLineVisible: false,
            });
            maSeries.setData(sanitizedMA as any);
          }
        });
      }

      // 4. Bollinger Bands Overlay
      if (showBB && indicators?.bollinger_bands) {
        const bb = indicators.bollinger_bands;
        [
          { data: bb.upper, color: "#7c3aed", title: "BB Upper" },
          { data: bb.middle, color: "#6d28d9", title: "BB Mid" },
          { data: bb.lower, color: "#7c3aed", title: "BB Lower" },
        ].forEach(({ data, color, title }) => {
          const sanitizedBB = sanitizeSeriesData(data as any);
          if (sanitizedBB.length > 0) {
            const s = chart.addLineSeries({
              color,
              lineWidth: 1,
              title,
              lineStyle: 2,
              lastValueVisible: false,
              priceLineVisible: false,
            });
            s.setData(sanitizedBB as any);
          }
        });
      }

      // 5. Volume Series
      const volSeries = chart.addHistogramSeries({
        color: "#26a69a",
        priceFormat: { type: "volume" },
        priceScaleId: "volume",
      });
      chart.priceScale("volume").applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
      volSeries.setData(
        candles.map((c: any) => ({
          time: c.time,
          value: c.volume || 0,
          color: c.close >= c.open ? "#26a69a44" : "#ef535044",
        })) as any
      );

      // 6. RSI Sub-Chart
      const sanitizedRSI = sanitizeSeriesData(indicators?.rsi);
      if (rsiRef.current && sanitizedRSI.length > 0) {
        const rsiChart = createChart(rsiRef.current, {
          ...CHART_THEME,
          width: rsiRef.current.clientWidth || 800,
          height: 130,
        });
        rsiChartRef.current = rsiChart;

        const rsiSeries = rsiChart.addLineSeries({ color: "#f59e0b", lineWidth: 2, title: "RSI" });
        rsiSeries.setData(sanitizedRSI as any);
      }

      // 7. MACD Sub-Chart
      const sanitizedMACD = sanitizeSeriesData(indicators?.macd?.macd);
      const sanitizedSignal = sanitizeSeriesData(indicators?.macd?.signal);
      const sanitizedHist = sanitizeSeriesData(indicators?.macd?.histogram);

      if (macdRef.current && sanitizedMACD.length > 0) {
        const macdChart = createChart(macdRef.current, {
          ...CHART_THEME,
          width: macdRef.current.clientWidth || 800,
          height: 130,
        });
        macdChartRef.current = macdChart;

        const macdLine = macdChart.addLineSeries({ color: "#2196f3", lineWidth: 2, title: "MACD" });
        macdLine.setData(sanitizedMACD as any);

        if (sanitizedSignal.length > 0) {
          const signalLine = macdChart.addLineSeries({ color: "#ff9800", lineWidth: 2, title: "Signal" });
          signalLine.setData(sanitizedSignal as any);
        }

        if (sanitizedHist.length > 0) {
          const histSeries = macdChart.addHistogramSeries({ title: "Histogram" });
          histSeries.setData(
            sanitizedHist.map((h: any) => ({
              time: h.time,
              value: h.value,
              color: h.value >= 0 ? "#26a69a88" : "#ef535088",
            })) as any
          );
        }
      }

      // 8. Safe Cross-Chart Range Synchronization (Avoid infinite loops via isSyncing flag)
      let isSyncing = false;
      const subCharts = [rsiChartRef.current, macdChartRef.current].filter(Boolean) as IChartApi[];

      if (subCharts.length > 0) {
        chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
          if (isSyncing || !range) return;
          isSyncing = true;
          try {
            subCharts.forEach((sc) => sc.timeScale().setVisibleLogicalRange(range));
          } catch (e) {
            // ignore sync boundary errors
          } finally {
            isSyncing = false;
          }
        });

        subCharts.forEach((sc) => {
          sc.timeScale().subscribeVisibleLogicalRangeChange((range) => {
            if (isSyncing || !range) return;
            isSyncing = true;
            try {
              chart.timeScale().setVisibleLogicalRange(range);
              subCharts.forEach((other) => {
                if (other !== sc) other.timeScale().setVisibleLogicalRange(range);
              });
            } catch (e) {
              // ignore sync boundary errors
            } finally {
              isSyncing = false;
            }
          });
        });
      }

      // Fit content
      chart.timeScale().fitContent();
      subCharts.forEach((sc) => sc.timeScale().fitContent());
    } catch (err: any) {
      console.error("StockChart render error:", err);
      setChartError(err?.message || "Error rendering stock chart");
    }

    // Responsive resize handler
    const handleResize = () => {
      if (chartRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({ width: chartRef.current.clientWidth });
      }
      if (rsiRef.current && rsiChartRef.current) {
        rsiChartRef.current.applyOptions({ width: rsiRef.current.clientWidth });
      }
      if (macdRef.current && macdChartRef.current) {
        macdChartRef.current.applyOptions({ width: macdRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
      if (rsiChartRef.current) {
        rsiChartRef.current.remove();
        rsiChartRef.current = null;
      }
      if (macdChartRef.current) {
        macdChartRef.current.remove();
        macdChartRef.current = null;
      }
    };
  }, [candles, indicators, showMA, showBB, CHART_THEME]);

  return (
    <div className="card p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.label}
              onClick={() => setSelectedPeriod(p)}
              className={clsx(
                "px-2.5 py-1 rounded-md text-xs sm:text-sm font-semibold transition-colors",
                selectedPeriod.label === p.label
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-200"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Overlay Toggles */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowMA((v) => !v)}
            className={clsx(
              "px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium border transition-colors",
              showMA
                ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                : "border-surface-border text-slate-500 dark:text-gray-500"
            )}
          >
            MA
          </button>
          <button
            onClick={() => setShowBB((v) => !v)}
            className={clsx(
              "px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium border transition-colors",
              showBB
                ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/10"
                : "border-surface-border text-slate-500 dark:text-gray-500"
            )}
          >
            Bollinger
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      {isLoading ? (
        <div className="h-[380px] flex items-center justify-center text-slate-500 dark:text-gray-400 text-sm font-medium animate-pulse">
          {t("table.loading")}
        </div>
      ) : isError || chartError ? (
        <div className="h-[380px] flex flex-col items-center justify-center text-slate-500 dark:text-gray-400 text-sm p-4 text-center">
          <p className="font-semibold text-rose-500 mb-1">ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນກຣາບ</p>
          <p className="text-xs text-slate-400 dark:text-gray-500 max-w-sm mb-3">
            {chartError || "ບໍ່ສາມາດດຶງປະຫວັດລາຄາສຳລັບຊ່ວງເວລານີ້ໄດ້"}
          </p>
          <button
            onClick={() => setSelectedPeriod(PERIODS[2])}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            ກັບໄປຊ່ວງ 1M (1 ເດືອນ)
          </button>
        </div>
      ) : candles.length === 0 ? (
        <div className="h-[380px] flex flex-col items-center justify-center text-slate-500 dark:text-gray-400 text-sm p-4 text-center">
          <p className="font-semibold text-slate-700 dark:text-gray-300 mb-1">
            ບໍ່ມີຂໍ້ມູນກຣາບສຳລັບຊ່ວງເວລານີ້ ({selectedPeriod.label})
          </p>
          <p className="text-xs text-slate-400 dark:text-gray-500 max-w-sm mb-3">
            ສຳລັບຫຸ້ນນີ້ ອາດມີປະຫວັດການຊື້ຂາຍບໍ່ເຖິງຊ່ວງເວລາທີ່ເລືອກ ກະລຸນາເລືອກຊ່ວງເວລາອື່ນ (1D, 5D, 1M, 3M)
          </p>
          <button
            onClick={() => setSelectedPeriod(PERIODS[2])}
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            ເລືອກຊ່ວງ 1M (1 ເດືອນ)
          </button>
        </div>
      ) : (
        <>
          <div ref={chartRef} className="w-full min-h-[380px]" />
          {indicators?.rsi && indicators.rsi.length > 0 && (
            <>
              <div className="mt-2 px-1 text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">
                RSI (14)
              </div>
              <div ref={rsiRef} className="w-full min-h-[130px]" />
            </>
          )}
          {indicators?.macd?.macd && indicators.macd.macd.length > 0 && (
            <>
              <div className="mt-2 px-1 text-xs text-slate-500 dark:text-gray-400 font-mono font-medium">
                MACD (12,26,9)
              </div>
              <div ref={macdRef} className="w-full min-h-[130px]" />
            </>
          )}
        </>
      )}
    </div>
  );
}
