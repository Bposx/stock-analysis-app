import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft, Star, ExternalLink, TrendingUp, TrendingDown,
  Building2, BookOpen, X, ChevronDown, ChevronUp,
  BarChart2, DollarSign, Percent, Calendar, TrendingUp as TrendIcon,
  ShieldCheck, AlertTriangle
} from "lucide-react";
import StockChart from "../components/StockChart";
import AnalysisReport from "../components/AnalysisReport";
import { useQuote, useCompanyInfo, useIndicators, useAddToWatchlist } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { getLocalizedCompanyName } from "../i18n/marketData";
import { getLocalizedCountry, getLocalizedIndustry, getLocalizedSector, getLocalizedDescription } from "../i18n/analysisI18n";

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────
function StatItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="font-mono text-sm text-gray-200 font-medium">{value ?? "—"}</p>
    </div>
  );
}

function formatNumber(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined) return "—";
  if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + "M";
  return n.toLocaleString("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function pct(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return (n * 100).toFixed(2) + "%";
}

// ─────────────────────────────────────────────────────────
// Investment Profile Modal
// ─────────────────────────────────────────────────────────
function InvestmentProfileModal({
  info, quote, symbol, onClose,
}: {
  info: any; quote: any; symbol: string; onClose: () => void;
}) {
  const { t, language } = useLanguage();
  const [showFullDesc, setShowFullDesc] = useState(false);

  // ──── Investment Decision Signals ────
  const signals: { label: string; ok: boolean | null; note: string }[] = [];

  if (info.pe_ratio != null)
    signals.push({
      label: "P/E Ratio",
      ok: info.pe_ratio < 25,
      note: info.pe_ratio < 15 ? t("detail.evalLowGood") : info.pe_ratio < 25 ? t("detail.evalModerate") : t("detail.evalHighCaution"),
    });
  if (info.pb_ratio != null)
    signals.push({
      label: "P/B Ratio",
      ok: info.pb_ratio < 3,
      note: info.pb_ratio < 1 ? t("detail.opportunity") : info.pb_ratio < 3 ? t("detail.evalFair") : t("detail.evalHighCaution"),
    });
  if (info.dividend_yield != null)
    signals.push({
      label: "Dividend Yield",
      ok: info.dividend_yield > 0.02,
      note: info.dividend_yield > 0.05 ? t("detail.evalHighGood") : info.dividend_yield > 0.02 ? t("detail.evalGood") : t("detail.evalLowCaution"),
    });
  if (info.roe != null)
    signals.push({
      label: "ROE",
      ok: info.roe > 0.12,
      note: info.roe > 0.2 ? t("detail.evalExcellent") : info.roe > 0.12 ? t("detail.evalGood") : t("detail.evalLowCaution"),
    });
  if (info.debt_to_equity != null)
    signals.push({
      label: "Debt/Equity",
      ok: info.debt_to_equity < 100,
      note: info.debt_to_equity < 50 ? t("detail.evalLowDebt") : info.debt_to_equity < 100 ? t("detail.evalModDebt") : t("detail.evalHighDebt"),
    });
  if (info.profit_margins != null)
    signals.push({
      label: "Profit Margin",
      ok: info.profit_margins > 0.1,
      note: info.profit_margins > 0.2 ? t("detail.evalHighGood") : info.profit_margins > 0.1 ? t("detail.evalGood") : t("detail.evalLowCaution"),
    });
  if (info.beta != null)
    signals.push({
      label: "Beta",
      ok: info.beta < 1.5,
      note: info.beta < 0.8 ? t("detail.evalLowRisk") : info.beta < 1.5 ? t("detail.evalModRisk") : t("detail.evalHighRisk"),
    });

  const goodCount = signals.filter(s => s.ok === true).length;
  const totalSignals = signals.length;
  const overallGood = totalSignals > 0 && goodCount >= Math.ceil(totalSignals / 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-3xl bg-[#0f1117] border border-white/10 rounded-2xl shadow-2xl z-10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-blue-400" />
            <h2 className="font-bold text-gray-100 text-lg">{t("detail.investmentTitle")}</h2>
            <span className="text-sm text-gray-500 font-mono">{symbol}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* ── ຂໍ້ມູນພື້ນຖານ ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 size={13} /> {t("detail.companyProfile")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              {info.founded && <StatItem label={t("detail.founded")} value={info.founded} />}
              <StatItem label={t("detail.sector")} value={getLocalizedSector(symbol, info.sector, language)} />
              <StatItem label={t("detail.industry")} value={getLocalizedIndustry(info.industry, language)} />
              <StatItem label={t("detail.country")} value={getLocalizedCountry(info.country, language)} />
              {info.city && <StatItem label={t("detail.city")} value={`${info.city}${info.state ? ", " + info.state : ""}`} />}
              {info.employees != null && <StatItem label={t("detail.employees")} value={info.employees.toLocaleString()} />}
            </div>
          </section>

          {/* ── ມູນຄ່າ & ຂະໜາດ ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <DollarSign size={13} /> {t("detail.metricsValue")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              <StatItem label={t("detail.marketCap")} value={formatNumber(info.market_cap ?? quote?.market_cap)} />
              <StatItem label={t("detail.totalAssets")} value={formatNumber(info.total_assets)} />
              <StatItem label={t("detail.totalRevenue")} value={formatNumber(info.total_revenue)} />
              <StatItem label={t("detail.netIncome")} value={formatNumber(info.net_income)} />
              <StatItem label={t("detail.high52")} value={formatNumber(info["52w_high"])} />
              <StatItem label={t("detail.low52")} value={formatNumber(info["52w_low"])} />
              <StatItem label={t("detail.avgVol")} value={formatNumber(info.avg_volume, 0)} />
              <StatItem label="EPS" value={info.eps?.toFixed(4)} />
            </div>
          </section>

          {/* ── Valuation ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BarChart2 size={13} /> {t("detail.valuationSection")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">P/E Ratio</p>
                <p className={`font-mono text-sm font-medium ${info.pe_ratio != null ? info.pe_ratio < 25 ? "text-green-400" : "text-red-400" : "text-gray-400"}`}>
                  {info.pe_ratio?.toFixed(2) ?? "—"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {info.pe_ratio != null ? (info.pe_ratio < 15 ? t("detail.evalLowGood") : info.pe_ratio < 25 ? t("detail.evalModerate") : t("detail.evalHighCaution")) : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">P/B Ratio</p>
                <p className={`font-mono text-sm font-medium ${info.pb_ratio != null ? info.pb_ratio < 3 ? "text-green-400" : "text-red-400" : "text-gray-400"}`}>
                  {info.pb_ratio?.toFixed(2) ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Beta</p>
                <p className={`font-mono text-sm font-medium ${info.beta != null ? info.beta < 1.5 ? "text-yellow-400" : "text-red-400" : "text-gray-400"}`}>
                  {info.beta?.toFixed(2) ?? "—"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {info.beta != null ? (info.beta < 0.8 ? t("detail.evalLowRisk") : info.beta < 1.5 ? t("detail.evalModRisk") : t("detail.evalHighRisk")) : ""}
                </p>
              </div>
              <StatItem label="Profit Margin" value={info.profit_margins != null ? pct(info.profit_margins) : undefined} />
            </div>
          </section>

          {/* ── Profitability ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendIcon size={13} /> {t("detail.profitabilitySection")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">ROE</p>
                <p className={`font-mono text-sm font-medium ${info.roe != null ? info.roe > 0.12 ? "text-green-400" : "text-red-400" : "text-gray-400"}`}>
                  {info.roe != null ? pct(info.roe) : "—"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {info.roe != null ? (info.roe > 0.2 ? t("detail.evalExcellent") : info.roe > 0.12 ? t("detail.evalGood") : t("detail.evalLowCaution")) : ""}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">ROA</p>
                <p className={`font-mono text-sm font-medium ${info.roa != null ? info.roa > 0.05 ? "text-green-400" : "text-yellow-400" : "text-gray-400"}`}>
                  {info.roa != null ? pct(info.roa) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Debt / Equity</p>
                <p className={`font-mono text-sm font-medium ${info.debt_to_equity != null ? info.debt_to_equity < 100 ? "text-green-400" : "text-red-400" : "text-gray-400"}`}>
                  {info.debt_to_equity?.toFixed(2) ?? "—"}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {info.debt_to_equity != null ? (info.debt_to_equity < 50 ? t("detail.evalLowDebt") : info.debt_to_equity < 100 ? t("detail.evalModDebt") : t("detail.evalHighDebt")) : ""}
                </p>
              </div>
              <StatItem label={t("detail.payoutRatio")} value={info.payout_ratio != null ? pct(info.payout_ratio) : undefined} />
            </div>
          </section>

          {/* ── Dividends ── */}
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Percent size={13} /> {t("detail.dividendsSection")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Dividend Yield</p>
                <p className={`font-mono text-sm font-medium ${info.dividend_yield != null ? info.dividend_yield > 0.02 ? "text-green-400" : "text-gray-400" : "text-gray-400"}`}>
                  {info.dividend_yield != null ? pct(info.dividend_yield) : "—"}
                </p>
              </div>
              <StatItem label={t("detail.dividendRate")} value={info.dividend_rate != null ? formatNumber(info.dividend_rate, 4) + " " + (quote?.currency || "USD") : undefined} />
              <StatItem label={t("detail.payoutRatio")} value={info.payout_ratio != null ? pct(info.payout_ratio) : undefined} />
            </div>

            {/* Dividend History */}
            {info.dividend_history && info.dividend_history.length > 0 ? (
              <div>
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Calendar size={11} /> {t("detail.dividendHistory")}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left text-gray-500 py-1.5 pr-4 font-normal">{t("detail.date")}</th>
                        <th className="text-right text-gray-500 py-1.5 font-normal">{t("detail.amount")} ({quote?.currency || "USD"})</th>
                      </tr>
                    </thead>
                    <tbody>
                      {info.dividend_history.map((d: { date: string; amount: number }, i: number) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/3">
                          <td className="py-1.5 pr-4 text-gray-400 font-mono">{d.date}</td>
                          <td className="py-1.5 text-right text-green-400 font-mono font-medium">{d.amount.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">{t("detail.noDividends")}</p>
            )}
          </section>

          {/* ── Investment Decision ── */}
          {signals.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ShieldCheck size={13} /> {t("detail.decisionSection")}
              </h3>

              {/* Overall summary */}
              <div className={`flex items-center gap-3 p-3 rounded-xl mb-4 border ${overallGood ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                {overallGood
                  ? <ShieldCheck size={20} className="text-green-400 shrink-0" />
                  : <AlertTriangle size={20} className="text-red-400 shrink-0" />
                }
                <div>
                  <p className={`font-semibold text-sm ${overallGood ? "text-green-400" : "text-red-400"}`}>
                    {overallGood ? t("detail.goodFundamentals") : t("detail.cautionFundamentals")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("detail.signalsGood")} {goodCount} / {totalSignals}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {signals.map((s, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${s.ok ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
                    <span className="text-gray-400">{s.label}</span>
                    <span className={`font-medium ${s.ok ? "text-green-400" : "text-red-400"}`}>{s.note}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Description ── */}
          {info.description && (
            <section>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen size={13} /> {t("detail.aboutCompany")}
              </h3>
              <p className={`text-sm text-gray-300 leading-relaxed font-sans ${showFullDesc ? "" : "line-clamp-4"}`}>
                {getLocalizedDescription(symbol, info.description, language)}
              </p>
              {info.description.length > 300 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-2 text-xs text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  {showFullDesc ? <><ChevronUp size={12} /> {t("detail.showLess")}</> : <><ChevronDown size={12} /> {t("detail.readMore")}</>}
                </button>
              )}
              {info.website && (
                <a href={info.website} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-1 mt-3 text-xs text-blue-400 hover:underline">
                  <ExternalLink size={12} /> {info.website}
                </a>
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────
export default function StockDetail() {
  const { symbol = "" } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { mutate: addToWatchlist } = useAddToWatchlist();
  const [showProfile, setShowProfile] = useState(false);

  const { data: quote, isLoading: loadingQuote } = useQuote(symbol, 30_000);
  const { data: info } = useCompanyInfo(symbol);
  const { data: indicators } = useIndicators(symbol);

  const cleanSym = symbol.replace("LSX:", "").toUpperCase();
  const LSX_LIST = ["BCEL", "EDL-GEN", "EDL", "PTL", "SVN", "PCD", "LCTC", "MHTL", "LAT", "VCL", "LALCO", "LCS", "JDB"];
  const isLSX = symbol.startsWith("LSX:") || LSX_LIST.includes(cleanSym);
  const isUp = (quote?.change ?? 0) >= 0;

  const localizedName = getLocalizedCompanyName(symbol, language);

  // RSI value
  const latestRSI = indicators?.rsi?.at(-1)?.value;
  const rsiColor = latestRSI != null
    ? latestRSI < 30 ? "text-up" : latestRSI > 70 ? "text-down" : "text-gray-300"
    : "text-gray-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 p-2 rounded-lg hover:bg-surface-hover text-gray-400 hover:text-gray-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold font-mono text-gray-100">{symbol}</h1>
            <span className="text-gray-400 text-sm">
              {localizedName !== symbol ? localizedName : (info?.name || "")}
            </span>
            {isLSX && (
              <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs px-2 py-0.5 rounded-full font-mono">
                🇱🇦 LSX
              </span>
            )}
          </div>

          {/* Price */}
          {loadingQuote ? (
            <div className="h-10 w-48 bg-surface-hover rounded animate-pulse mt-2" />
          ) : quote ? (
            <div className="flex items-end gap-3 mt-2">
              <span className="text-4xl font-bold font-mono text-gray-100">
                {formatNumber(quote.price)}
              </span>
              <div className={`flex items-center gap-1 pb-1 ${isUp ? "text-up" : "text-down"}`}>
                {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                <span className="font-mono font-medium">
                  {isUp ? "+" : ""}{formatNumber(quote.change, 2)}
                  {" "}({isUp ? "+" : ""}{quote.change_pct?.toFixed(2)}%)
                </span>
              </div>
              <span className="text-gray-500 text-sm pb-1">{quote.currency}</span>
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex gap-2 shrink-0 flex-wrap justify-end">
          {/* Profile Button */}
          {info && !isLSX && (
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 rounded-lg text-sm font-medium transition-colors"
            >
              <BookOpen size={15} /> {t("detail.profileBtn")}
            </button>
          )}
          <button
            onClick={() => addToWatchlist({ symbol, source: isLSX ? "lsx" : "yahoo" })}
            className="flex items-center gap-1.5 px-3 py-2 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 rounded-lg text-sm font-medium transition-colors"
          >
            <Star size={15} /> {t("detail.saveBtn")}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {quote && (
        <div className="card p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <StatItem label={t("table.open")} value={formatNumber(quote.open)} />
          <StatItem label={t("table.high")} value={formatNumber(quote.high)} />
          <StatItem label={t("table.low")} value={formatNumber(quote.low)} />
          <StatItem label={t("table.volume")} value={formatNumber(quote.volume, 0)} />
          <StatItem label={t("table.prevClose")} value={formatNumber(quote.previous_close)} />
          <StatItem label={t("detail.marketCap")} value={formatNumber(quote.market_cap)} />
        </div>
      )}

      {/* Indicator Summary */}
      <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">RSI (14)</p>
          <p className={`font-mono text-lg font-bold ${rsiColor}`}>
            {latestRSI?.toFixed(1) ?? "—"}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {latestRSI != null ? latestRSI < 30 ? "Oversold ⚡" : latestRSI > 70 ? "Overbought ⚠️" : "Neutral" : ""}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">MACD</p>
          {indicators?.macd?.macd?.at(-1) && (
            <p className={`font-mono text-lg font-bold ${(indicators.macd.macd.at(-1)?.value ?? 0) >= 0 ? "text-up" : "text-down"}`}>
              {indicators.macd.macd.at(-1)?.value.toFixed(3)}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">BB Width</p>
          {indicators?.bollinger_bands && (() => {
            const u = indicators.bollinger_bands.upper.at(-1)?.value ?? 0;
            const l = indicators.bollinger_bands.lower.at(-1)?.value ?? 0;
            return <p className="font-mono text-lg font-bold text-gray-200">{(u - l).toFixed(2)}</p>;
          })()}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">MA20</p>
          <p className="font-mono text-lg font-bold text-blue-400">
            {formatNumber(indicators?.moving_averages?.ma20?.at(-1)?.value)}
          </p>
        </div>
      </div>

      {/* Analysis Report & Recommendation */}
      <AnalysisReport symbol={symbol} currency={quote?.currency || (isLSX ? "LAK" : "USD")} />

      {/* Chart */}
      <StockChart symbol={isLSX ? cleanSym : symbol} currency={quote?.currency} />

      {/* Company Info (compact card — non-LSX) */}
      {info && !isLSX && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-400" />
              <h3 className="font-bold text-gray-100">{t("detail.companyProfile")}</h3>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1"
            >
              <BookOpen size={12} /> {t("detail.fullDetails")}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <StatItem label={t("detail.sector")} value={getLocalizedSector(symbol, info.sector, language)} />
            <StatItem label={t("detail.industry")} value={getLocalizedIndustry(info.industry, language)} />
            <StatItem label={t("detail.country")} value={getLocalizedCountry(info.country, language)} />
            <StatItem label={t("detail.employees")} value={info.employees?.toLocaleString()} />
            <StatItem label={t("detail.peRatio")} value={info.pe_ratio?.toFixed(2)} />
            <StatItem label={t("detail.pbRatio")} value={info.pb_ratio?.toFixed(2)} />
            <StatItem label={t("detail.dividendYield")} value={info.dividend_yield ? pct(info.dividend_yield) : "—"} />
            <StatItem label={t("detail.high52")} value={formatNumber(info["52w_high"])} />
          </div>
          {info.description && (
            <p className="text-sm text-gray-300 leading-relaxed font-sans line-clamp-3">
              {getLocalizedDescription(symbol, info.description, language)}
            </p>
          )}
          {info.website && (
            <a href={info.website} target="_blank" rel="noopener noreferrer"
               className="inline-flex items-center gap-1 mt-3 text-xs text-blue-400 hover:underline">
              <ExternalLink size={12} /> {info.website}
            </a>
          )}
        </div>
      )}

      {/* Investment Profile Modal */}
      {showProfile && info && (
        <InvestmentProfileModal
          info={info}
          quote={quote}
          symbol={symbol}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
}
