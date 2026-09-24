import MarketOverview from "../components/MarketOverview";
import WatchlistPanel from "../components/WatchlistPanel";
import { useLanguage } from "../i18n/LanguageContext";

export default function Dashboard() {
  const { t, language } = useLanguage();

  const getLocale = () => {
    switch (language) {
      case "th": return "th-TH";
      case "en": return "en-US";
      case "zh": return "zh-CN";
      default: return "lo-LA";
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{t("dashboard.title")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("dashboard.marketOverview")} — {new Date().toLocaleDateString(getLocale(), { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
        <MarketOverview />
      </div>

      {/* Sidebar */}
      <div className="w-72 shrink-0 space-y-4 hidden lg:block">
        <WatchlistPanel />
      </div>
    </div>
  );
}
