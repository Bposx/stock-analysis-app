import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, Search, TrendingUp, X, Globe, ChevronDown, Check, Sun, Moon } from "lucide-react";
import { useSearch } from "../hooks/useStockData";
import { useLanguage } from "../i18n/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Language } from "../i18n/translations";
import clsx from "clsx";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/90 dark:bg-surface-hover hover:bg-sky-50 dark:hover:bg-surface-border text-slate-700 dark:text-gray-200 border border-sky-200/80 dark:border-surface-border text-sm font-medium transition-colors flex items-center justify-center shadow-xs"
      title={theme === "dark" ? t("theme.light") : t("theme.dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={17} className="text-amber-400 transition-transform hover:rotate-45 duration-200" />
      ) : (
        <Moon size={17} className="text-blue-600 transition-transform hover:-rotate-12 duration-200" />
      )}
    </button>
  );
}

function LanguageSelector() {
  const { language, setLanguage, languages, currentLangOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-surface-hover hover:bg-sky-50 dark:hover:bg-surface-border text-slate-700 dark:text-gray-200 border border-sky-200/80 dark:border-surface-border text-sm font-medium transition-colors shadow-xs"
        title="Change Language / ປ່ຽນພາສາ"
      >
        <span className="text-base leading-none">{currentLangOption.flag}</span>
        <span className="hidden sm:inline font-medium text-sm">{currentLangOption.nativeName}</span>
        <ChevronDown size={14} className={clsx("text-slate-400 dark:text-gray-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-surface-card border border-sky-200 dark:border-surface-border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1.5 text-xs font-bold text-sky-800 dark:text-gray-400 uppercase tracking-wider border-b border-sky-100 dark:border-surface-border/50">
            Language / ພາສາ
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as Language);
                setOpen(false);
              }}
              className={clsx(
                "w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors hover:bg-sky-50 dark:hover:bg-surface-hover text-left",
                language === lang.code
                  ? "text-blue-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-500/10"
                  : "text-slate-700 dark:text-gray-300"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg leading-none">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.nativeName}</span>
              </div>
              {language === lang.code && <Check size={16} className="text-blue-600 dark:text-sky-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchBar() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: results } = useSearch(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    setQuery("");
    setOpen(false);
    navigate(`/stock/${symbol}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;
    if (results && results.length > 0) {
      handleSelect(results[0].symbol);
    } else {
      handleSelect(clean);
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2.5 bg-white/90 dark:bg-surface-hover/80 hover:bg-white dark:hover:bg-surface-border/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 border border-sky-200/80 dark:border-surface-border rounded-lg px-3.5 py-1.5 md:py-2 transition-all shadow-xs"
      >
        <button
          type="submit"
          className="text-slate-400 dark:text-gray-400 hover:text-blue-600 dark:hover:text-sky-400 shrink-0 transition-colors p-0.5"
          title="Search / ຄົ້ນຫາ"
        >
          <Search size={17} />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={t("nav.searchPlaceholder")}
          className="bg-transparent outline-none text-sm sm:text-base text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-500 w-full min-w-0"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true);
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="text-slate-400 hover:text-slate-600 dark:text-gray-500 dark:hover:text-gray-300 p-0.5"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {open && results && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-surface-card border border-sky-200 dark:border-surface-border rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto divide-y divide-sky-100 dark:divide-surface-border/50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2 text-xs font-bold text-sky-800 dark:text-gray-400 uppercase tracking-wider bg-sky-50/70 dark:bg-surface/50">
            {results.length} Results / ຜົນການຄົ້ນຫາ
          </div>
          {results.slice(0, 10).map((r: any) => (
            <button
              key={r.symbol}
              type="button"
              className="w-full text-left px-4 py-2.5 hover:bg-sky-50/80 dark:hover:bg-surface-hover transition-colors flex items-center justify-between group"
              onClick={() => handleSelect(r.symbol)}
            >
              <div>
                <span className="font-mono font-bold text-slate-900 dark:text-gray-100 text-base group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                  {r.symbol}
                </span>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{r.name}</p>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-gray-400 font-mono px-2.5 py-1 rounded bg-sky-100/60 dark:bg-surface/60 border border-sky-200/50 dark:border-surface-border/40">
                {r.exchange}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { t, language } = useLanguage();
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: t("nav.dashboard"), icon: BarChart3 },
    { to: "/stocks/lao", alias: "/lsx", label: t("nav.laoStocks"), flag: "🇱🇦" },
    { to: "/stocks/thai", label: t("nav.thaiStocks"), flag: "🇹🇭" },
    { to: "/stocks/vietnam", label: t("nav.vietnamStocks"), flag: "🇻🇳" },
    { to: "/stocks/china", label: t("nav.chinaStocks"), flag: "🇨🇳" },
    { to: "/stocks/japan", label: t("nav.japanStocks"), flag: "🇯🇵" },
    { to: "/stocks/us", label: t("nav.usStocks"), flag: "🇺🇸" },
    { to: "/stocks/other", label: t("nav.otherCrypto"), icon: Globe },
  ];

  const isLinkActive = (to: string, alias?: string) => {
    if (to === "/dashboard") return location.pathname === "/dashboard" || location.pathname === "/";
    return location.pathname.startsWith(to) || (alias ? location.pathname.startsWith(alias) : false);
  };

  const getLocaleForClock = () => {
    switch (language) {
      case "th": return "th-TH";
      case "en": return "en-US";
      case "zh": return "zh-CN";
      default: return "lo-LA";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#f0f7ff]/95 via-[#ebf4fe]/95 to-[#f3f8fe]/95 dark:from-[#0b1329]/95 dark:via-[#0c1630]/95 dark:to-[#0f1a38]/95 border-b border-sky-200/80 dark:border-blue-900/40 shadow-[0_4px_20px_-4px_rgba(37,99,235,0.08)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors duration-200">
      {/* Decorative top accent gradient stripe */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 shadow-sm" />

      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Top Row: Logo | Search Bar | Theme & Language & Clock */}
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white block tracking-tight">{t("nav.brand")}</span>
              <span className="text-xs text-sky-600 dark:text-sky-400 font-bold block uppercase tracking-wider">{t("nav.brandSubtitle")}</span>
            </div>
          </Link>

          {/* Search Bar - Prominent & Clickable */}
          <div className="flex-1 max-w-lg min-w-0">
            <SearchBar />
          </div>

          {/* Controls: Theme Toggle + Language Selector + Clock */}
          <div className="shrink-0 flex items-center gap-2.5">
            <ThemeToggle />
            <LanguageSelector />
            <div className="text-sm text-sky-800 dark:text-sky-300 font-mono hidden md:block whitespace-nowrap px-3 py-1.5 rounded-lg bg-sky-100/70 dark:bg-blue-950/40 border border-sky-200/70 dark:border-blue-900/40 font-semibold shadow-xs">
              {new Date().toLocaleTimeString(getLocaleForClock(), { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>

        {/* Bottom Row: Market Navigation Tabs */}
        <div className="flex items-center gap-2 pb-2.5 overflow-x-auto no-scrollbar border-t border-sky-200/50 dark:border-blue-950/60 pt-2">
          {links.map(({ to, alias, label, icon: Icon, flag }) => {
            const active = isLinkActive(to, alias);
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0",
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 border border-blue-600 font-semibold dark:bg-blue-600 dark:text-white dark:border-blue-500"
                    : "text-slate-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white hover:bg-sky-100/70 dark:hover:bg-surface-hover border border-transparent"
                )}
              >
                {flag ? <span className="text-base leading-none">{flag}</span> : Icon ? <Icon size={16} /> : null}
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
