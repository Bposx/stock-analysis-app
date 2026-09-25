import { Link } from "react-router-dom";
import { TrendingUp, ShieldAlert, Activity, Globe, Database, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import VisitorCounter from "./VisitorCounter";

export default function Footer() {
  const { t } = useLanguage();

  const markets = [
    { to: "/stocks/lao", label: t("nav.laoStocks"), flag: "🇱🇦" },
    { to: "/stocks/thai", label: t("nav.thaiStocks"), flag: "🇹🇭" },
    { to: "/stocks/vietnam", label: t("nav.vietnamStocks"), flag: "🇻🇳" },
    { to: "/stocks/china", label: t("nav.chinaStocks"), flag: "🇨🇳" },
    { to: "/stocks/japan", label: t("nav.japanStocks"), flag: "🇯🇵" },
    { to: "/stocks/us", label: t("nav.usStocks"), flag: "🇺🇸" },
    { to: "/stocks/other", label: t("nav.otherCrypto"), flag: "🌐" },
    { to: "/brokers", label: t("nav.brokers"), flag: "🏛️" },
  ];

  return (
    <footer className="mt-auto relative bg-gradient-to-b from-[#f0f7ff] via-[#e8f3fe] to-[#ddedfc] dark:from-[#0b1329] dark:via-[#090f20] dark:to-[#060a16] border-t border-sky-200/80 dark:border-blue-900/40 text-slate-700 dark:text-gray-300 transition-colors duration-200">
      {/* Decorative top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 opacity-80" />

      <div className="container mx-auto px-4 max-w-[1400px] pt-12 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Brand & Mission (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/dashboard" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                <TrendingUp size={22} className="text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  {t("nav.brand")}
                </span>
                <span className="block text-xs sm:text-sm font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  {t("nav.brandSubtitle")}
                </span>
              </div>
            </Link>

            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed max-w-md">
              {t("footer.tagline")}
            </p>

            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{t("footer.systemStatus")}</span>
            </div>
          </div>

          {/* Markets Quick Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe size={16} className="text-sky-600 dark:text-sky-400" />
              <span>{t("footer.quickNav")}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {markets.map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-sky-300 hover:bg-sky-100/70 dark:hover:bg-blue-950/50 transition-colors group font-medium"
                >
                  <span className="text-base leading-none">{m.flag}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                    {m.label}
                  </span>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity ml-auto" />
                </Link>
              ))}
            </div>
          </div>

          {/* Data Sources & Indicators (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Database size={16} className="text-sky-600 dark:text-sky-400" />
              <span>{t("footer.dataSource")}</span>
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-sky-150 dark:border-blue-950 shadow-xs">
                <Activity size={16} className="text-blue-500 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-gray-200">Yahoo Finance API</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">Global Markets & Real-time Quotes</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-sky-150 dark:border-blue-950 shadow-xs">
                <TrendingUp size={16} className="text-emerald-500 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-gray-200">Lao Securities Exchange (LSX)</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">Live Scraped Official Board</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Visitor Statistics Counter */}
        <div className="mb-6">
          <VisitorCounter />
        </div>

        {/* Disclaimer Banner Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-sky-100/60 dark:bg-blue-950/30 border border-sky-200/80 dark:border-blue-900/40 mb-8">
          <div className="flex items-start gap-3">
            <ShieldAlert size={18} className="text-sky-700 dark:text-sky-400 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <span className="font-bold text-sky-900 dark:text-sky-300 mr-2">
                {t("footer.disclaimerTitle")}:
              </span>
              <span className="text-slate-700 dark:text-gray-300">
                {t("footer.disclaimer")}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Details */}
        <div className="pt-5 border-t border-sky-200/60 dark:border-blue-950/60 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 dark:text-gray-400 gap-3">
          <div>
            © {new Date().getFullYear()} <span className="font-semibold text-slate-800 dark:text-gray-200">StockLao Analytics</span>. {t("footer.rights")}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-sky-100/80 dark:bg-blue-950/60 text-sky-800 dark:text-sky-400 border border-sky-200/60 dark:border-blue-900/40 font-semibold">
              v1.0.0 Pro
            </span>
            <span className="text-slate-400 dark:text-gray-600">·</span>
            <span>Real-time Financial Analytics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
