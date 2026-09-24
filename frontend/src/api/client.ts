import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// Types
export interface Quote {
  symbol: string;
  price: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  volume: number | null;
  previous_close: number | null;
  change: number;
  change_pct: number;
  currency: string;
  market_cap: number | null;
  timestamp: string;
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface LSXStock {
  symbol: string;
  company_name: string;
  sector: string;
  price: number | null;
  change: number | null;
  change_pct: number | null;
  volume: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  last_updated: string | null;
}

export interface IndicatorPoint {
  time: number;
  value: number;
}

export interface Indicators {
  symbol: string;
  rsi?: IndicatorPoint[];
  macd?: { macd: IndicatorPoint[]; signal: IndicatorPoint[]; histogram: IndicatorPoint[] };
  bollinger_bands?: { upper: IndicatorPoint[]; middle: IndicatorPoint[]; lower: IndicatorPoint[] };
  moving_averages?: Record<string, IndicatorPoint[]>;
  stochastic?: { k: IndicatorPoint[]; d: IndicatorPoint[] };
}

// API Functions
export const stocksApi = {
  getQuote: (symbol: string) => api.get<{ success: boolean; data: Quote }>(`/stocks/quote/${symbol}`),
  getHistory: (symbol: string, period = "1mo", interval = "1d") =>
    api.get<{ success: boolean; data: Candle[] }>(`/stocks/history/${symbol}`, { params: { period, interval } }),
  getInfo: (symbol: string) => api.get(`/stocks/info/${symbol}`),
  search: (q: string) => api.get(`/stocks/search`, { params: { q } }),
  getPopular: () => api.get("/stocks/popular"),
  getCategory: (category: string) =>
    api.get<{ success: boolean; category: string; info: any; data: Quote[] }>(`/stocks/category/${category}`),
  getMultipleQuotes: (symbols: string[]) => api.post<{ success: boolean; data: Quote[] }>("/stocks/quotes", symbols),
};

export const lsxApi = {
  getMarket: () => api.get("/lsx/market"),
  getStocks: () => api.get<{ success: boolean; data: LSXStock[] }>("/lsx/stocks"),
  getStock: (symbol: string) => api.get(`/lsx/stocks/${symbol}`),
  getHistory: (symbol: string) => api.get(`/lsx/history/${symbol}`),
  refresh: () => api.post("/lsx/refresh"),
};

export interface IndicatorBreakdown {
  name: string;
  signal: string;
  status: string;
  desc: string;
}

export interface AnalysisResult {
  signal: "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL" | "NEUTRAL";
  action_label: string;
  action_color: "green" | "yellow" | "red" | "gray";
  can_buy: boolean;
  can_sell: boolean;
  score: number;
  trend: string;
  current_price: number;
  support: number;
  resistance: number;
  stop_loss: number;
  take_profit: number;
  summary_text: string;
  outlook_text: string;
  recommendation_text: string;
  breakdown: IndicatorBreakdown[];
}

export const indicatorsApi = {
  get: (symbol: string, params?: Record<string, string>) =>
    api.get<{ success: boolean; data: Indicators }>(`/indicators/${symbol}`, { params }),
  getAnalysis: (symbol: string, period = "1y") =>
    api.get<{ success: boolean; data: AnalysisResult }>(`/indicators/analysis/${symbol}`, { params: { period } }),
};

export const watchlistApi = {
  get: () => api.get("/watchlist/"),
  add: (symbol: string, source = "yahoo", note = "") =>
    api.post("/watchlist/", { symbol, source, note }),
  remove: (id: number) => api.delete(`/watchlist/${id}`),
};
