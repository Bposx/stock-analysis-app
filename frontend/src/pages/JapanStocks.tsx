import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Search, RefreshCw, BarChart2 } from "lucide-react";
import { useCategoryStocks } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import {
  JAPAN_STOCKS_DATA,
  getLocalizedCompanyName,
  getLocalizedSectorLabel,
  getMarketSectorsList,
} from "../i18n/marketData";
import type { Quote } from "../api/client";
import clsx from "clsx";

type SortField = "symbol" | "price" | "change_pct" | "volume";
type SortDir = "asc" | "desc";

export default function JapanStocks() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [sortField, setSortField] = useState<SortField>("change_pct");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: result, isLoading, refetch, isFetching } = useCategoryStocks("japan");
  const quotes: Quote[] = result?.data ?? [];

  // Nikkei 225
  const nikkei = quotes.find((q) => q.symbol === "^N225");
  const stockQuotes = quotes.filter((q) => q.symbol !== "^N225");

  const sectors = useMemo(() => {
    return [
      { key: "all", label: t("table.allSectors") },
      ...getMarketSectorsList(JAPAN_STOCKS_DATA, language),
    ];
  }, [language, t]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    return stockQuotes
      .filter((q) => {
        const info = JAPAN_STOCKS_DATA[q.symbol];
        const localizedName = getLocalizedCompanyName(q.symbol, language);
        const matchSearch =
          q.symbol.toLowerCase().includes(search.toLowerCase()) ||
          localizedName.toLowerCase().includes(search.toLowerCase());
        const matchSector = selectedSector === "all" || info?.sectorKey === selectedSector;
        return matchSearch && matchSector;
      })
      .sort((a, b) => {
        let aVal = a[sortField] ?? 0;
        let bVal = b[sortField] ?? 0;
        if (sortField === "symbol") {
          return sortDir === "asc" ? a.symbol.localeCompare(b.symbol) : b.symbol.localeCompare(a.symbol);
        }
        return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
      });
  }, [stockQuotes, search, selectedSector, sortField, sortDir, language]);

  // Statistics
  const advances = stockQuotes.filter((q) => (q.change_pct ?? 0) > 0).length;
  const declines = stockQuotes.filter((q) => (q.change_pct ?? 0) < 0).length;
  const unchanged = stockQuotes.filter((q) => (q.change_pct ?? 0) === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇯🇵</span>
            <h1 className="text-2xl font-bold text-gray-100">{t("dashboard.japanMarket")}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {t("market.japanSubtitle")}
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

      {/* Market Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Nikkei 225 Card */}
        <div className="card p-4 border-l-4 border-l-brand-500">
          <p className="text-xs text-gray-500 mb-1">Nikkei 225 (^N225)</p>
          <p className="font-mono text-2xl font-bold text-gray-100">
            {nikkei?.price?.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "—"}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={clsx("text-xs font-semibold", (nikkei?.change_pct ?? 0) >= 0 ? "text-up" : "text-down")}>
              {(nikkei?.change_pct ?? 0) >= 0 ? "+" : ""}{nikkei?.change?.toFixed(2)} ({(nikkei?.change_pct ?? 0) >= 0 ? "+" : ""}{nikkei?.change_pct?.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">{t("dashboard.advances")}</p>
          <p className="font-mono text-2xl font-bold text-up">{advances}</p>
          <p className="text-xs text-gray-500 mt-1">{t("dashboard.upCount")}</p>
        </div>

        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">{t("dashboard.declines")}</p>
          <p className="font-mono text-2xl font-bold text-down">{declines}</p>
          <p className="text-xs text-gray-500 mt-1">{t("dashboard.downCount")}</p>
        </div>

        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">{t("dashboard.unchanged")}</p>
          <p className="font-mono text-2xl font-bold text-gray-400">{unchanged}</p>
          <p className="text-xs text-gray-500 mt-1">{t("dashboard.flatCount")}</p>
        </div>
      </div>

      {/* Top 4 Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {stockQuotes.slice(0, 4).map((q) => {
          const isUp = (q.change ?? 0) >= 0;
          const localizedName = getLocalizedCompanyName(q.symbol, language);
          return (
            <button
              key={q.symbol}
              onClick={() => navigate(`/stock/${q.symbol}`)}
              className="card p-4 text-left hover:border-brand-500/50 hover:bg-surface-hover transition-all group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-bold text-sm text-gray-100 group-hover:text-brand-400">
                    {q.symbol}
                  </span>
                  <p className="text-xs text-gray-500 truncate max-w-[130px]">{localizedName}</p>
                </div>
                {isUp ? <TrendingUp size={16} className="text-up" /> : <TrendingDown size={16} className="text-down" />}
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-mono text-lg font-bold text-gray-100">
                  {q.price?.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  <span className="text-xs text-gray-500 ml-1 font-normal">JPY</span>
                </span>
                <span className={clsx("text-xs font-semibold", isUp ? "text-up" : "text-down")}>
                  {isUp ? "+" : ""}{q.change_pct?.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Sector Filters */}
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

        {/* Sector Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {sectors.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setSelectedSector(sec.key)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                selectedSector === sec.key
                  ? "bg-brand-500 text-white"
                  : "bg-surface-card text-gray-400 hover:text-gray-200 hover:bg-surface-hover border border-surface-border"
              )}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stocks Table */}
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
                  {t("table.price")} (JPY) {sortField === "price" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="px-4 py-3 text-right cursor-pointer hover:text-gray-200 select-none"
                  onClick={() => handleSort("change_pct")}
                >
                  {t("table.change")} {sortField === "change_pct" ? (sortDir === "asc" ? "↑" : "↓") : ""}
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
                filtered.map((stock) => {
                  const isUp = (stock.change ?? 0) >= 0;
                  const info = JAPAN_STOCKS_DATA[stock.symbol];
                  const localizedName = getLocalizedCompanyName(stock.symbol, language);
                  const localizedSector = info ? getLocalizedSectorLabel(info.sectorKey, language) : "Tokyo Stock Exchange";
                  return (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-surface-hover/70 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/stock/${stock.symbol}`)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-mono font-bold text-gray-100 group-hover:text-brand-400">
                          {stock.symbol}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {localizedName}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded bg-surface border border-surface-border text-[11px]">
                          {localizedSector}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-bold text-gray-100">
                        {stock.price !== null && stock.price !== undefined
                          ? stock.price.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold">
                        <div className={clsx("flex items-center justify-end gap-1", isUp ? "text-up" : "text-down")}>
                          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                          <span>
                            {isUp ? "+" : ""}{stock.change?.toFixed(2)} ({isUp ? "+" : ""}{stock.change_pct?.toFixed(2)}%)
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-gray-400 hidden sm:table-cell">
                        {stock.high ? stock.high.toLocaleString() : "—"} / {stock.low ? stock.low.toLocaleString() : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-xs text-gray-400 hidden lg:table-cell">
                        {stock.volume?.toLocaleString() ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/stock/${stock.symbol}`);
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
