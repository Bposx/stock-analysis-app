import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { useLSXStocks, useLSXMarket } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { getLocalizedCompanyName, getLocalizedSectorLabel } from "../i18n/marketData";
import { lsxApi } from "../api/client";
import type { LSXStock } from "../api/client";
import clsx from "clsx";

type SortField = "symbol" | "price" | "change_pct" | "volume";
type SortDir = "asc" | "desc";

export default function LSXMarket() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("symbol");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [refreshing, setRefreshing] = useState(false);

  const { data: market } = useLSXMarket();
  const { data: stocks = [], isLoading, refetch } = useLSXStocks();

  const handleRefresh = async () => {
    setRefreshing(true);
    await lsxApi.refresh();
    setTimeout(() => { refetch(); setRefreshing(false); }, 3000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = stocks
    .filter((s) => {
      const q = search.toLowerCase();
      const locName = getLocalizedCompanyName(s.symbol, language).toLowerCase();
      const locSector = getLocalizedSectorLabel(s.sector, language).toLowerCase();
      return (
        s.symbol.toLowerCase().includes(q) ||
        (s.company_name || "").toLowerCase().includes(q) ||
        locName.includes(q) ||
        locSector.includes(q)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      const cmp = typeof aVal === "string" ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const ThBtn = ({ field, label }: { field: SortField; label: string }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-gray-400 cursor-pointer hover:text-gray-200 select-none"
      onClick={() => handleSort(field)}
    >
      {label} {sortField === field ? (sortDir === "asc" ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            🇱🇦 {t("dashboard.laoMarket")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("market.lsxSubtitle")}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? t("table.refreshing") : t("table.refresh")}
        </button>
      </div>

      {/* Market Summary */}
      {market && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "LSX Index", value: market.lsx_index?.toFixed(2) ?? "—", sub: `${market.lsx_change_pct >= 0 ? "+" : ""}${market.lsx_change_pct?.toFixed(2)}%`, color: market.lsx_change_pct >= 0 ? "text-up" : "text-down" },
            { label: t("dashboard.advances"), value: market.advances ?? "—", sub: t("dashboard.upCount"), color: "text-up" },
            { label: t("dashboard.declines"), value: market.declines ?? "—", sub: t("dashboard.downCount"), color: "text-down" },
            { label: t("dashboard.unchanged"), value: market.unchanged ?? "—", sub: t("dashboard.flatCount"), color: "text-gray-400" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="card p-4">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`font-mono text-2xl font-bold ${color}`}>{value}</p>
              <p className={`text-xs mt-1 ${color}`}>{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-surface-border">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={t("table.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-surface-border rounded-lg pl-8 pr-3 py-1.5 text-sm text-gray-200 outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                <ThBtn field="symbol" label="Symbol" />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">{t("table.symbolCompany")}</th>
                <ThBtn field="price" label={`${t("table.price")} (LAK)`} />
                <ThBtn field="change_pct" label={`${t("table.change")} %`} />
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">{t("table.open")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">{t("table.high")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">{t("table.low")}</th>
                <ThBtn field="volume" label={t("table.volume")} />
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">{t("table.sector")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-surface-hover rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    {t("table.noData")}
                  </td>
                </tr>
              ) : (
                filtered.map((stock) => {
                  const isUp = (stock.change_pct ?? 0) > 0;
                  const isDown = (stock.change_pct ?? 0) < 0;
                  const locName = getLocalizedCompanyName(stock.symbol, language);
                  const displayName = locName !== stock.symbol ? locName : stock.company_name;
                  const locSector = getLocalizedSectorLabel(stock.sector, language);

                  return (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-surface-hover cursor-pointer transition-colors"
                      onClick={() => navigate(`/stock/LSX:${stock.symbol}`)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-gray-100">{stock.symbol}</td>
                      <td className="px-4 py-3 text-gray-300 max-w-[260px] truncate" title={displayName}>
                        {displayName}
                      </td>
                      <td className="px-4 py-3 font-mono text-right font-medium text-gray-100">
                        {stock.price?.toLocaleString() ?? "—"}
                      </td>
                      <td className={clsx("px-4 py-3 font-mono text-right font-medium flex items-center gap-1 justify-end",
                        isUp ? "text-up" : isDown ? "text-down" : "text-gray-400")}>
                        {isUp ? <TrendingUp size={12} /> : isDown ? <TrendingDown size={12} /> : <Minus size={12} />}
                        {stock.change_pct != null ? `${isUp ? "+" : ""}${stock.change_pct.toFixed(2)}%` : "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-right text-gray-400">{stock.open?.toLocaleString() ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-right text-gray-400">{stock.high?.toLocaleString() ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-right text-gray-400">{stock.low?.toLocaleString() ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-right text-gray-400">{stock.volume?.toLocaleString() ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{locSector}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 border-t border-surface-border text-xs text-gray-500 flex items-center justify-between">
          <span>{filtered.length} {t("watchlist.items")}</span>
          <span>{t("table.source")} lsx.com.la</span>
        </div>
      </div>
    </div>
  );
}
