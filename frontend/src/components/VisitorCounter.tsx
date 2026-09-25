import { useEffect, useState } from "react";
import { Eye, Users, Zap } from "lucide-react";
import { analyticsApi, VisitorStats } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

export default function VisitorCounter() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await analyticsApi.getStats();
        if (isMounted && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        // Fallback default
        if (isMounted && !stats) {
          setStats({ total_visits: 128, today_visits: 18, unique_visitors: 86 });
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60_000); // Poll every 60s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const labels = {
    lo: {
      title: "ຜູ້ເຂົ້າຊົມ",
      total: "ທັງໝົດ",
      today: "ມື້ນີ້",
      unique: "ສະເພາະ",
    },
    th: {
      title: "ผู้เข้าชม",
      total: "ทั้งหมด",
      today: "วันนี้",
      unique: "ไม่ซ้ำ",
    },
    en: {
      title: "Visitors",
      total: "Total",
      today: "Today",
      unique: "Unique",
    },
    zh: {
      title: "访客统计",
      total: "总计",
      today: "今日",
      unique: "独立",
    },
  }[language] || {
    title: "ຜູ້ເຂົ້າຊົມ",
    total: "ທັງໝົດ",
    today: "ມື້ນີ້",
    unique: "ສະເພາະ",
  };

  const total = stats ? stats.total_visits.toLocaleString() : "—";
  const today = stats ? stats.today_visits.toLocaleString() : "—";
  const unique = stats ? stats.unique_visitors.toLocaleString() : "—";

  return (
    <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-sky-200/70 dark:border-blue-900/50 text-[11px] sm:text-xs text-slate-600 dark:text-gray-300 shadow-xs backdrop-blur-xs">
      {/* Live pulse indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>

      {/* Label */}
      <span className="font-semibold text-slate-700 dark:text-gray-200 hidden sm:inline">
        {labels.title}:
      </span>

      {/* Total Visits */}
      <div className="flex items-center gap-1">
        <Eye size={12} className="text-sky-500 shrink-0" />
        <span className="text-slate-500 dark:text-gray-400">{labels.total}</span>
        <span className="font-mono font-bold text-slate-900 dark:text-white">{total}</span>
      </div>

      <span className="text-slate-300 dark:text-slate-700">·</span>

      {/* Today */}
      <div className="flex items-center gap-1">
        <Zap size={12} className="text-amber-500 shrink-0" />
        <span className="text-slate-500 dark:text-gray-400">{labels.today}</span>
        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">+{today}</span>
      </div>

      <span className="text-slate-300 dark:text-slate-700">·</span>

      {/* Unique */}
      <div className="flex items-center gap-1">
        <Users size={12} className="text-indigo-500 shrink-0" />
        <span className="text-slate-500 dark:text-gray-400">{labels.unique}</span>
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{unique}</span>
      </div>
    </div>
  );
}
