import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LANGUAGES, translations, TranslationKey, LanguageOption } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  currentLangOption: LanguageOption;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "stock_app_lang";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved && (saved === "lo" || saved === "th" || saved === "en" || saved === "zh")) {
      return saved;
    }
    return "lo";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    const titles: Record<Language, string> = {
      lo: "StockLao — ລະບົບວິເຄາະຫຸ້ນ LSX & ຕະຫຼາດຫຸ້ນຕ່າງປະເທດ",
      th: "StockLao — ระบบวิเคราะห์หุ้น LSX & ตลาดหุ้นต่างประเทศ",
      en: "StockLao — LSX & Global Stock Analysis System",
      zh: "StockLao — 老挝LSX与全球股票分析系统",
    };
    document.title = titles[language] || titles.lo;
  }, [language]);

  const t = (key: TranslationKey, fallback?: string): string => {
    const langDict = translations[language] as Record<string, string>;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to Lao or English
    const laoDict = translations.lo as Record<string, string>;
    if (laoDict && laoDict[key]) {
      return laoDict[key];
    }
    return fallback ?? key;
  };

  const currentLangOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLangOption,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
