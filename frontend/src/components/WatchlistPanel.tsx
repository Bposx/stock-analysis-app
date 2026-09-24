import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Trash2, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useWatchlist, useRemoveFromWatchlist, useAddToWatchlist } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";

export default function WatchlistPanel() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [addInput, setAddInput] = useState("");
  const [addSource, setAddSource] = useState<"yahoo" | "lsx">("yahoo");
  const { data: items = [], isLoading } = useWatchlist();
  const { mutate: remove } = useRemoveFromWatchlist();
  const { mutate: add, isPending } = useAddToWatchlist();

  const handleAdd = () => {
    if (!addInput.trim()) return;
    add({ symbol: addInput.trim().toUpperCase(), source: addSource });
    setAddInput("");
  };

  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Star size={16} className="text-yellow-400" />
        <h3 className="font-bold text-gray-100">{t("watchlist.title")}</h3>
        <span className="ml-auto text-xs text-gray-500">{items.length} {t("watchlist.items")}</span>
      </div>

      {/* Add */}
      <div className="flex gap-2 mb-4">
        <select
          value={addSource}
          onChange={(e) => setAddSource(e.target.value as any)}
          className="bg-surface border border-surface-border rounded-lg px-2 py-1.5 text-xs text-gray-300 outline-none"
        >
          <option value="yahoo">Yahoo</option>
          <option value="lsx">LSX</option>
        </select>
        <input
          type="text"
          placeholder={t("watchlist.symbolPlaceholder")}
          className="flex-1 bg-surface border border-surface-border rounded-lg px-3 py-1.5 text-sm text-gray-200 outline-none focus:border-brand-500"
          value={addInput}
          onChange={(e) => setAddInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          disabled={isPending}
          className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          title={t("watchlist.add")}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-xs text-gray-500 animate-pulse">{t("table.loading")}</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-4">{t("watchlist.empty")}</p>
      ) : (
        <div className="space-y-1">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-surface-hover group transition-colors"
            >
              <button
                className="flex-1 text-left"
                onClick={() => navigate(`/stock/${item.symbol}`)}
              >
                <span className="font-mono font-semibold text-sm text-gray-200">{item.symbol}</span>
                <span className="text-xs text-gray-600 ml-2">{item.source.toUpperCase()}</span>
              </button>
              <button
                onClick={() => remove(item.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-down transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
