import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  Target,
  Sparkles,
  Compass,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useStockAnalysis } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { getLocalizedAnalysisTexts, getLocalizedBreakdownItem } from "../i18n/analysisI18n";
import clsx from "clsx";

interface Props {
  symbol: string;
  currency?: string;
}

export default function AnalysisReport({ symbol, currency = "LAK" }: Props) {
  const { t, language } = useLanguage();
  const { data: analysis, isLoading, error } = useStockAnalysis(symbol);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (isLoading) {
    return (
      <div className="card p-5 animate-pulse space-y-4">
        <div className="h-6 bg-surface-hover rounded w-1/3" />
        <div className="h-20 bg-surface-hover rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="h-24 bg-surface-hover rounded" />
          <div className="h-24 bg-surface-hover rounded" />
          <div className="h-24 bg-surface-hover rounded" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return null;
  }

  const {
    signal,
    action_label,
    action_color,
    can_buy,
    can_sell,
    score,
    trend,
    current_price,
    support,
    resistance,
    stop_loss,
    take_profit,
    summary_text,
    outlook_text,
    recommendation_text,
    breakdown,
  } = analysis;

  const localizedTexts = getLocalizedAnalysisTexts(analysis, language);

  const isBuy = action_color === "green";
  const isSell = action_color === "red";
  const isHold = action_color === "yellow";

  const localizedActionLabel = (() => {
    switch (signal) {
      case "STRONG_BUY":
        return t("analysis.strongBuy");
      case "BUY":
        return t("analysis.buy");
      case "HOLD":
        return t("analysis.hold");
      case "SELL":
        return t("analysis.sell");
      case "STRONG_SELL":
        return t("analysis.strongSell");
      default:
        return action_label;
    }
  })();

  const bannerBg = isBuy
    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
    : isSell
    ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
    : "bg-amber-500/10 border-amber-500/30 text-amber-400";

  const badgeColor = isBuy
    ? "bg-emerald-500 text-white shadow-emerald-500/20"
    : isSell
    ? "bg-rose-500 text-white shadow-rose-500/20"
    : "bg-amber-500 text-white shadow-amber-500/20";

  return (
    <div className="card p-5 space-y-5 border border-surface-border">
      {/* 1. Header & Main Signal Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
              {t("analysis.title")}
              <span className="text-xs font-normal text-gray-400">
                (AI & Technical Forecast)
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              {t("analysis.aiGenerated")}
            </p>
          </div>
        </div>

        {/* Signal Badge & Decision Pill */}
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "px-4 py-2 rounded-xl font-bold text-sm tracking-wide shadow-lg flex items-center gap-2",
              badgeColor
            )}
          >
            {isBuy ? (
              <TrendingUp size={18} />
            ) : isSell ? (
              <TrendingDown size={18} />
            ) : (
              <Minus size={18} />
            )}
            {localizedActionLabel}
          </div>

          <div
            className={clsx(
              "px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5",
              bannerBg
            )}
          >
            {can_buy ? (
              <>
                <CheckCircle2 size={14} /> {t("analysis.buy")}
              </>
            ) : can_sell ? (
              <>
                <AlertTriangle size={14} /> {t("analysis.sell")}
              </>
            ) : (
              <>
                <Compass size={14} /> {t("analysis.hold")}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Score Meter Bar */}
      <div className="space-y-1.5 bg-surface/50 p-3.5 rounded-xl border border-surface-border">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400 font-medium flex items-center gap-1.5">
            <Compass size={14} className="text-brand-500" />
            {t("analysis.technicalScore")} (Technical Bullish Score)
          </span>
          <span className="font-mono font-bold text-gray-100 text-sm">
            {score} / 100
          </span>
        </div>
        <div className="w-full bg-surface-card rounded-full h-2.5 overflow-hidden flex border border-surface-border">
          <div
            className={clsx(
              "h-full transition-all duration-500 rounded-full",
              score >= 60
                ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                : score <= 40
                ? "bg-gradient-to-r from-rose-600 to-rose-400"
                : "bg-gradient-to-r from-amber-600 to-amber-400"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>{t("analysis.meterBearish")}</span>
          <span>{t("analysis.meterNeutral")}</span>
          <span>{t("analysis.meterBullish")}</span>
        </div>
      </div>

      {/* 3. Three Key Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Current Analysis */}
        <div className="p-4 rounded-xl bg-surface/60 border border-surface-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("analysis.cardCurrent")}
              </span>
              <span
                className={clsx(
                  "text-xs font-mono px-2 py-0.5 rounded",
                  score >= 58
                    ? "bg-emerald-500/10 text-emerald-400"
                    : score <= 40
                    ? "bg-rose-500/10 text-rose-400"
                    : "bg-amber-500/10 text-amber-400"
                )}
              >
                {localizedTexts.trend}
              </span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed font-sans">
              {localizedTexts.summary}
            </p>
          </div>
        </div>

        {/* Card 2: Future Outlook */}
        <div className="p-4 rounded-xl bg-surface/60 border border-surface-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t("analysis.cardForecast")}
              </span>
              <span className="text-xs text-brand-500 font-mono">{t("analysis.forecastTag")}</span>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed font-sans">
              {localizedTexts.outlook}
            </p>
          </div>
        </div>

        {/* Card 3: Action Recommendation */}
        <div
          className={clsx(
            "p-4 rounded-xl border flex flex-col justify-between",
            isBuy
              ? "bg-emerald-950/20 border-emerald-500/30"
              : isSell
              ? "bg-rose-950/20 border-rose-500/30"
              : "bg-amber-950/20 border-amber-500/30"
          )}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                {t("analysis.cardAction")}
              </span>
              <span
                className={clsx(
                  "text-xs font-bold font-mono",
                  isBuy
                    ? "text-emerald-400"
                    : isSell
                    ? "text-rose-400"
                    : "text-amber-400"
                )}
              >
                {can_buy ? "ACTION: BUY" : can_sell ? "ACTION: SELL" : "ACTION: HOLD"}
              </span>
            </div>
            <p className="text-sm text-gray-100 font-medium leading-relaxed font-sans">
              {localizedTexts.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Strategic Price Targets & Trading Levels */}
      <div className="p-4 rounded-xl bg-surface/40 border border-surface-border">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target size={14} className="text-brand-500" />
          {t("analysis.supportResistance")}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-surface-card rounded-lg border border-surface-border">
            <span className="text-[11px] text-gray-500 block mb-0.5">
              🛡️ {t("analysis.support")}
            </span>
            <span className="font-mono font-bold text-gray-200 text-sm">
              {support ? support.toLocaleString() : "—"}{" "}
              <span className="text-xs font-normal text-gray-500">{currency}</span>
            </span>
          </div>

          <div className="p-3 bg-surface-card rounded-lg border border-surface-border">
            <span className="text-[11px] text-gray-500 block mb-0.5">
              🎯 {t("analysis.resistance")}
            </span>
            <span className="font-mono font-bold text-gray-200 text-sm">
              {resistance ? resistance.toLocaleString() : "—"}{" "}
              <span className="text-xs font-normal text-gray-500">{currency}</span>
            </span>
          </div>

          <div className="p-3 bg-surface-card rounded-lg border border-rose-500/20 bg-rose-500/5">
            <span className="text-[11px] text-rose-400 block mb-0.5 font-medium">
              🛑 {t("analysis.stopLoss")}
            </span>
            <span className="font-mono font-bold text-rose-300 text-sm">
              {stop_loss ? stop_loss.toLocaleString() : "—"}{" "}
              <span className="text-xs font-normal text-gray-500">{currency}</span>
            </span>
          </div>

          <div className="p-3 bg-surface-card rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <span className="text-[11px] text-emerald-400 block mb-0.5 font-medium">
              🚀 {t("analysis.targetPrice")}
            </span>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              {take_profit ? take_profit.toLocaleString() : "—"}{" "}
              <span className="text-xs font-normal text-gray-500">{currency}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Collapsible Breakdown Table */}
      {breakdown && breakdown.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex items-center justify-between w-full text-xs text-gray-400 hover:text-gray-200 transition-colors py-1"
          >
            <span className="font-medium font-sans">
              {showBreakdown ? t("analysis.hideBreakdown") : t("analysis.showBreakdown")} ({breakdown.length} {t("analysis.indicatorsCount")})
            </span>
            {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showBreakdown && (
            <div className="mt-3 space-y-2">
              {breakdown.map((item, idx) => {
                const isItemBuy = item.signal.includes("BUY");
                const isItemSell = item.signal.includes("SELL");
                const locItem = getLocalizedBreakdownItem(item, language);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-surface rounded-lg border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-200">{locItem.name}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-400">{locItem.status}</span>
                      </div>
                      <p className="text-gray-400 leading-normal font-sans">{locItem.desc}</p>
                    </div>

                    <div className="shrink-0 self-start sm:self-center">
                      <span
                        className={clsx(
                          "px-2.5 py-1 rounded-md font-mono font-semibold text-[11px]",
                          isItemBuy
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : isItemSell
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        )}
                      >
                        {item.signal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}