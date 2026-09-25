import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import LSXMarket from "./pages/LSXMarket";
import ThaiStocks from "./pages/ThaiStocks";
import VietnamStocks from "./pages/VietnamStocks";
import ChinaStocks from "./pages/ChinaStocks";
import JapanStocks from "./pages/JapanStocks";
import USStocks from "./pages/USStocks";
import OtherStocks from "./pages/OtherStocks";
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { analyticsApi } from "./api/client";

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    try {
      let vid = localStorage.getItem("lao_stock_vid");
      if (!vid) {
        vid = "v_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
        localStorage.setItem("lao_stock_vid", vid);
      }
      analyticsApi.track(location.pathname, vid).catch(() => {});
    } catch {
      // Ignore if tracking fails
    }
  }, [location.pathname]);

  return null;
}

function AppContent() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 max-w-[1400px]">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/stocks/lao" element={<LSXMarket />} />
              <Route path="/lsx" element={<Navigate to="/stocks/lao" replace />} />
              <Route path="/stocks/thai" element={<ThaiStocks />} />
              <Route path="/stocks/vietnam" element={<VietnamStocks />} />
              <Route path="/stocks/china" element={<ChinaStocks />} />
              <Route path="/stocks/japan" element={<JapanStocks />} />
              <Route path="/stocks/us" element={<USStocks />} />
              <Route path="/stocks/other" element={<OtherStocks />} />
              <Route path="/stock/:symbol" element={<StockDetail />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
