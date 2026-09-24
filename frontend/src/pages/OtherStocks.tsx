import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Search, RefreshCw, BarChart2, Coins, Flame, Globe2 } from "lucide-react";
import { useCategoryStocks } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { OTHER_ASSETS_DATA } from "../i18n/marketData";
import type { Quote } from "../api/client";
import clsx from "clsx";

type SortField = "symbol" | "price" | "change_pct" | "volume";
type SortDir = "asc" | "desc";

export default function OtherStocks() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("change_pct");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: result, isLoading, refetch, isFetching } = useCategoryStocks("other");
  const quotes: Quote[] = result?.data ?? [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    return quotes
      .filter((q) => {
        const meta = OTHER_ASSETS_DATA[q.symbol];
        const localizedName = meta ? meta.name[language] || meta.name.en : q.symbol;
        const matchSearch =
          q.symbol.toLowerCase().includes(search.toLowerCase()) ||
          localizedName.toLowerCase().includes(search.toLowerCase());
        const matchType = selectedType === "all" || meta?.type === selectedType;
        return matchSearch && matchType;
      })
      .sort((a, b) => {
        let aVal = a[sortField] ?? 0;
        let bVal = b[sortField] ?? 0;
        if (sortField === "symbol") {
          return sortDir === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
        }
        return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      });
  }, [quotes, search, selectedType, sortField, sortDir, language]);

  // Featured highlights
  const btc = quotes.find((q) => q.symbol === "BTC-USD");
  const eth = quotes.find((q) => q.symbol === "ETH-USD");
  const gold = quotes.find((q) => q.symbol === "GC=F");
  const oil = quotes.find((q) => q.symbol === "CL=F");

  const filterTabs = [
    { id: "all", label: t("table.allTypes"), icon: Globe2 },
    { id: "crypto", label: t("table.crypto"), icon: Coins },
    { id: "commodity", label: t("table.commodity"), icon: Flame },
    { id: "index", label: t("table.indices"), icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h1 className="text-2xl font-bold text-gray-100">{t("dashboard.otherMarket")}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t("market.otherSubtitle")}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
          {isFetching ? t("table.refreshing") : t("table.refresh")}
        </button>
      </div>

      {/* Featured 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { q: btc, sym: "BTC-USD", fallback: "Bitcoin", icon: "₿", label: "BTC/USD" },
          { q: eth, sym: "ETH-USD", fallback: "Ethereum", icon: "Ξ", label: "ETH/USD" },
          { q: gold, sym: "GC=F", fallback: "Gold", icon: "🥇", label: "GC=F / USD" },
          { q: oil, sym: "CL=F", fallback: "Crude Oil", icon: "🛢️", label: "CL=F / USD" },
        ].map(({ q, sym, fallback, icon, label }) => {
          const isUp = (q?.change_pct ?? 0) >= 0;
          const meta = OTHER_ASSETS_DATA[sym];
          const title = meta ? meta.name[language] || fallback : fallback;
          return (
            <button
              key={label}
              onClick={() => q && navigate(`/stock/${q.symbol}`)}
              className="card p-4 text-left hover:border-brand-500/50 hover:bg-surface-hover transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="font-bold text-sm text-gray-100 group-hover:text-brand-400 truncate max-w-[130px]">{title}</p>
                    <p className="text-xs text-gray-500 font-mono">{label}</p>
                  </div>
                </div>
                {isUp ? <TrendingUp size={16} className="text-up" /> : <TrendingDown size={16} className="text-down" />}
              </div>
              <p className="font-mono text-xl font-bold text-gray-100">
                {q?.price !== null && q?.price !== undefined
                  ? `$${q.price.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "—"}
              </p>
              <p className={clsx("text-xs font-semibold mt-1", isUp ? "text-up" : "text-down")}>
                {isUp ? "+" : ""}{q?.change_pct?.toFixed(2)}%
              </p>
            </button>
          );
        })}
      </div>

      {/* Search & Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative max-w-sm flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={t("table.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 outline-none focus:border-brand-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                selectedType === id
                  ? "bg-brand-500 text-white"
                  : "bg-surface-card text-gray-400 hover:text-gray-200 hover:bg-surface-hover border border-surface-border"
              )}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border bg-surface-hover/50 text-xs text-gray-400">
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:text-gray-200 select-none"
                  onClick={() => handleSort("symbol")}
                >
                  {t("table.symbolCompany")} {sortField === "symbol" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">{t("table.sector")}</th>
                <th
                  className="px-4 py-3 text-right cursor-pointer hover:text-gray-200 select-none"
                  onClick={() => handleSort("price")}
                >
                  {t("table.price")} (USD) {sortField === "price" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="px-4 py-3 text-right cursor-pointer hover:text-gray-200 select-none"
                  onClick={() => handleSort("change_pct")}
                >
                  {t("table.change")} 24h {sortField === "change_pct" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">{t("table.dayRange")}</th>
                <th
                  className="px-4 py-3 text-right hidden lg:table-cell cursor-pointer hover:text-gray-200 select-none"
                  onClick={() => handleSort("volume")}
                >
                  {t("table.volume")} {sortField === "volume" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-3 text-center">{t("table.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <RefreshCw className="animate-spin inline-block mr-2" size={16} />
                    {t("table.loading")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    {t("table.noData")}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isUp = (item.change ?? 0) >= 0;
                  const meta = OTHER_ASSETS_DATA[item.symbol];
                  const localizedName = meta ? meta.name[language] || item.symbol : item.symbol;
                  const typeLabel = meta?.type === "crypto"
                    ? t("table.crypto")
                    : meta?.type === "commodity"
                    ? t("table.commodity")
                    : t("table.indices");

                  return (
                    <tr
                      key={item.symbol}
                      className="hover:bg-surface-hover/70 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/stock/${item.symbol}`)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {meta?.icon && <span className="text-base">{meta.icon}</span>}
                          <div>
                            <span className="font-mono font-bold text-gray-100 group-hover:text-brand-400">
                              {item.symbol}
                            </span>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{localizedName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[11px]">
                          {typeLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-100">
                        {item.price !== null && item.price !== undefined
                          ? `$${item.price.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold">
                        <div className={clsx("flex items-center justify-end gap-1", isUp ? "text-up" : "text-down")}>
                          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          <span>
                            {isUp ? "+" : ""}{item.change?.toFixed(2)} ({isUp ? "+" : ""}{item.change_pct?.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-gray-400 hidden sm:table-cell">
                        ${item.high ? item.high.toFixed(2) : "—"} / ${item.low ? item.low.toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-gray-400 hidden lg:table-cell">
                        {item.volume ? item.volume.toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/stock/${item.symbol}`);
                          }}
                          className="px-2.5 py-1 rounded bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 text-xs font-medium transition-colors"
                        >
                          <BarChart2 size={13} className="inline mr-1" />
                          {t("table.chart")}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
