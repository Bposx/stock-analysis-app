import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw, Sparkles, Globe, DollarSign } from "lucide-react";
import { usePopularStocks, useLSXMarket, useLSXStocks } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { getLocalizedCompanyName } from "../i18n/marketData";
import type { Quote, LSXStock } from "../api/client";
import clsx from "clsx";

const TOP_PREVIEW_NAMES: Record<string, string> = {
  // Vietnam
  "VCB.VN": "Vietcombank",
  "VNM.VN": "Vinamilk",
  "HPG.VN": "Hoa Phat Group",
  "FPT.VN": "FPT Corp",
  "VIC.VN": "Vingroup",
  "VHM.VN": "Vinhomes",
  // China
  "600519.SS": "Moutai",
  "002594.SZ": "BYD",
  "300750.SZ": "CATL",
  "601398.SS": "ICBC",
  "BABA": "Alibaba",
  "PDD": "PDD / Temu",
  // Japan
  "7203.T": "Toyota",
  "6758.T": "Sony",
  "9984.T": "SoftBank",
  "7974.T": "Nintendo",
  "8035.T": "Tokyo Electron",
};

function PriceChange({ value, suffix = "%" }: { value?: number | null; suffix?: string }) {
  if (value === null || value === undefined) return <span className="text-gray-500">—</span>;
  const isUp = value > 0;
  const isDown = value < 0;
  return (
    <span className={clsx("font-mono text-xs font-semibold", isUp ? "text-up" : isDown ? "text-down" : "text-gray-400")}>
      {isUp ? "+" : ""}{value.toFixed(2)}{suffix}
    </span>
  );
}

function MiniStockCard({
  symbol,
  name,
  price,
  change,
  changePct,
  currency,
  onClick,
}: {
  symbol: string;
  name?: string;
  price?: number | null;
  change?: number | null;
  changePct?: number | null;
  currency: string;
  onClick: () => void;
}) {
  const isUp = (changePct ?? 0) >= 0;
  return (
    <button
      onClick={onClick}
      className="card p-3 text-left hover:border-brand-500/50 hover:bg-surface-hover transition-all group"
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <span className="font-mono font-bold text-sm text-gray-100 group-hover:text-brand-400 transition-colors">
            {symbol}
          </span>
          {name && <p className="text-[11px] text-gray-500 truncate max-w-[110px]">{name}</p>}
        </div>
        {isUp ? <TrendingUp size={14} className="text-up mt-0.5 shrink-0" /> : <TrendingDown size={14} className="text-down mt-0.5 shrink-0" />}
      </div>
      <p className="font-mono text-base font-bold text-gray-100 mt-1">
        {price !== null && price !== undefined
          ? price.toLocaleString("en", {
              minimumFractionDigits: currency === "VND" || currency === "JPY" || currency === "LAK" ? 0 : 2,
              maximumFractionDigits: currency === "VND" || currency === "JPY" || currency === "LAK" ? 0 : 2,
            })
          : "—"}
        <span className="text-[10px] text-gray-500 ml-1 font-normal">{currency}</span>
      </p>
      <div className="flex items-center gap-1.5 mt-1">
        <PriceChange value={change} suffix="" />
        <span className="text-gray-600 text-xs">|</span>
        <PriceChange value={changePct} />
      </div>
    </button>
  );
}

export default function MarketOverview() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: popular, isLoading: loadingPop } = usePopularStocks();
  const { data: lsxMarket } = useLSXMarket();
  const { data: lsxStocks } = useLSXStocks();

  const quoteMap: Record<string, Quote> = {};
  (popular?.data ?? []).forEach((q: Quote) => {
    quoteMap[q.symbol] = q;
  });

  const setIndex = quoteMap["^SET.BK"];
  const vnIndex = quoteMap["VNM"];
  const sseIndex = quoteMap["000001.SS"];
  const nikkeiIndex = quoteMap["^N225"];
  const sp500 = quoteMap["^GSPC"];
  const btc = quoteMap["BTC-USD"];

  // Market Previews
  const thaiSymbols: string[] = (popular?.categories?.thai ?? ["PTT.BK", "AOT.BK", "CPALL.BK", "DELTA.BK"]).slice(0, 4);
  const vietnamSymbols: string[] = (popular?.categories?.vietnam ?? ["VCB.VN", "VNM.VN", "HPG.VN", "FPT.VN"]).slice(0, 4);
  const chinaSymbols: string[] = (popular?.categories?.china ?? ["600519.SS", "002594.SZ", "300750.SZ", "BABA"]).slice(0, 4);
  const japanSymbols: string[] = (popular?.categories?.japan ?? ["7203.T", "6758.T", "9984.T", "7974.T"]).slice(0, 4);
  const usSymbols: string[] = (popular?.categories?.us ?? ["AAPL", "NVDA", "MSFT", "TSLA"]).slice(0, 4);
  const cryptoSymbols: string[] = (popular?.categories?.crypto ?? ["BTC-USD", "ETH-USD", "SOL-USD"]).slice(0, 3);
  const commoditySymbols: string[] = (popular?.categories?.commodities ?? ["GC=F", "CL=F"]).slice(0, 2);
  const otherPreview: string[] = [...cryptoSymbols, ...commoditySymbols].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Global Markets Overview Snapshot Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* 1. LSX Snapshot */}
        <div
          onClick={() => navigate("/stocks/lao")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-brand-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇱🇦</span>
              <span className="font-bold text-xs text-gray-200">LSX</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">LSX Composite</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {lsxMarket?.lsx_index?.toFixed(2) ?? "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={lsxMarket?.lsx_change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>

        {/* 2. SET Snapshot */}
        <div
          onClick={() => navigate("/stocks/thai")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-blue-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇹🇭</span>
              <span className="font-bold text-xs text-gray-200">SET</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">SET Index</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {setIndex?.price?.toFixed(2) ?? "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={setIndex?.change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>

        {/* 3. Vietnam Snapshot */}
        <div
          onClick={() => navigate("/stocks/vietnam")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-amber-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇻🇳</span>
              <span className="font-bold text-xs text-gray-200">Vietnam</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">VN ETF (VNM)</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {vnIndex?.price ? `$${vnIndex.price.toFixed(2)}` : "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={vnIndex?.change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>

        {/* 4. China Snapshot */}
        <div
          onClick={() => navigate("/stocks/china")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-rose-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇨🇳</span>
              <span className="font-bold text-xs text-gray-200">China</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">SSE Composite</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {sseIndex?.price ? sseIndex.price.toFixed(0) : "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={sseIndex?.change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>

        {/* 5. Japan Snapshot */}
        <div
          onClick={() => navigate("/stocks/japan")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-red-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇯🇵</span>
              <span className="font-bold text-xs text-gray-200">Japan</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">Nikkei 225</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {nikkeiIndex?.price ? nikkeiIndex.price.toLocaleString("en", { maximumFractionDigits: 0 }) : "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={nikkeiIndex?.change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>

        {/* 6. US Snapshot */}
        <div
          onClick={() => navigate("/stocks/us")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-emerald-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🇺🇸</span>
              <span className="font-bold text-xs text-gray-200">US S&P</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">S&P 500</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {sp500?.price ? sp500.price.toFixed(0) : "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={sp500?.change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>

        {/* 7. Crypto Snapshot */}
        <div
          onClick={() => navigate("/stocks/other")}
          className="card p-3.5 hover:border-brand-500/60 transition-all cursor-pointer group bg-gradient-to-br from-surface-card to-amber-950/20"
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🌐</span>
              <span className="font-bold text-xs text-gray-200">Crypto</span>
            </div>
            <ArrowRight size={12} className="text-gray-500 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-[10px] text-gray-500 truncate">Bitcoin</p>
          <p className="font-mono text-lg font-bold text-gray-100 mt-0.5">
            {btc?.price ? `$${btc.price.toLocaleString("en", { maximumFractionDigits: 0 })}` : "—"}
          </p>
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-surface-border/50 text-[11px]">
            <PriceChange value={btc?.change_pct} />
            <span className="text-[10px] text-brand-400 font-medium group-hover:underline">→</span>
          </div>
        </div>
      </div>

      {/* 🇱🇦 Section: Lao Stocks Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇱🇦</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.laoMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.laoSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/lao")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {lsxStocks && lsxStocks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {lsxStocks.slice(0, 4).map((s: LSXStock) => {
              const locName = getLocalizedCompanyName(s.symbol, language);
              const displayName = locName !== s.symbol ? locName : (s.company_name?.split(" ")[0] || s.symbol);
              return (
                <MiniStockCard
                  key={s.symbol}
                  symbol={s.symbol}
                  name={displayName}
                  price={s.price}
                  change={s.change}
                  changePct={s.change_pct}
                  currency="LAK"
                  onClick={() => navigate(`/stock/LSX:${s.symbol}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        )}
      </div>

      {/* 🇹🇭 Section: Thai Stocks Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇹🇭</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.thaiMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.thaiSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/thai")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingPop ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {thaiSymbols.map((s) => (
              <div key={s} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {thaiSymbols.map((s) => {
              const q = quoteMap[s];
              if (!q) return null;
              return (
                <MiniStockCard
                  key={q.symbol}
                  symbol={q.symbol}
                  name={getLocalizedCompanyName(q.symbol, language)}
                  price={q.price}
                  change={q.change}
                  changePct={q.change_pct}
                  currency="THB"
                  onClick={() => navigate(`/stock/${q.symbol}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 🇻🇳 Section: Vietnam Stocks Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇻🇳</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.vietnamMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.vietnamSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/vietnam")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingPop ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {vietnamSymbols.map((s) => (
              <div key={s} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vietnamSymbols.map((s) => {
              const q = quoteMap[s];
              if (!q) return null;
              return (
                <MiniStockCard
                  key={q.symbol}
                  symbol={q.symbol}
                  name={getLocalizedCompanyName(q.symbol, language)}
                  price={q.price}
                  change={q.change}
                  changePct={q.change_pct}
                  currency="VND"
                  onClick={() => navigate(`/stock/${q.symbol}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 🇨🇳 Section: China Stocks Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇨🇳</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.chinaMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.chinaSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/china")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingPop ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {chinaSymbols.map((s) => (
              <div key={s} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {chinaSymbols.map((s) => {
              const q = quoteMap[s];
              if (!q) return null;
              const isUsd = q.symbol === "BABA" || q.symbol === "PDD";
              return (
                <MiniStockCard
                  key={q.symbol}
                  symbol={q.symbol}
                  name={getLocalizedCompanyName(q.symbol, language)}
                  price={q.price}
                  change={q.change}
                  changePct={q.change_pct}
                  currency={isUsd ? "USD" : "CNY"}
                  onClick={() => navigate(`/stock/${q.symbol}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 🇯🇵 Section: Japan Stocks Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇯🇵</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.japanMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.japanSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/japan")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingPop ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {japanSymbols.map((s) => (
              <div key={s} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {japanSymbols.map((s) => {
              const q = quoteMap[s];
              if (!q) return null;
              return (
                <MiniStockCard
                  key={q.symbol}
                  symbol={q.symbol}
                  name={getLocalizedCompanyName(q.symbol, language)}
                  price={q.price}
                  change={q.change}
                  changePct={q.change_pct}
                  currency="JPY"
                  onClick={() => navigate(`/stock/${q.symbol}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 🇺🇸 Section: US Stocks Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇺🇸</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.usMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.usSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/us")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingPop ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {usSymbols.map((s) => (
              <div key={s} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {usSymbols.map((s) => {
              const q = quoteMap[s];
              if (!q) return null;
              return (
                <MiniStockCard
                  key={q.symbol}
                  symbol={q.symbol}
                  price={q.price}
                  change={q.change}
                  changePct={q.change_pct}
                  currency="USD"
                  onClick={() => navigate(`/stock/${q.symbol}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 🌐 Section: Other Assets & Crypto Preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌐</span>
            <div>
              <h2 className="font-bold text-gray-100 text-base">{t("dashboard.otherMarket")}</h2>
              <p className="text-xs text-gray-500">{t("dashboard.otherSubtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/stocks/other")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-xs font-medium transition-colors"
          >
            <span>{t("dashboard.viewAll")}</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loadingPop ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pulse">
            {otherPreview.map((s) => (
              <div key={s} className="card p-3 h-24 bg-surface-hover/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {otherPreview.map((s) => {
              const q = quoteMap[s];
              if (!q) return null;
              return (
                <MiniStockCard
                  key={q.symbol}
                  symbol={q.symbol}
                  price={q.price}
                  change={q.change}
                  changePct={q.change_pct}
                  currency="USD"
                  onClick={() => navigate(`/stock/${q.symbol}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
