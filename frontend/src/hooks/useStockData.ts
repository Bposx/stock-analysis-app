import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stocksApi, lsxApi, indicatorsApi, watchlistApi } from "../api/client";

// ====== Stock Hooks ======
export function useQuote(symbol: string, refetchInterval = 30_000) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => stocksApi.getQuote(symbol).then((r) => r.data.data),
    refetchInterval,
    enabled: !!symbol,
  });
}

export function useHistory(symbol: string, period = "1mo", interval = "1d") {
  return useQuery({
    queryKey: ["history", symbol, period, interval],
    queryFn: () => stocksApi.getHistory(symbol, period, interval).then((r) => r.data.data),
    staleTime: 60_000,
    enabled: !!symbol,
  });
}

export function useCompanyInfo(symbol: string) {
  return useQuery({
    queryKey: ["info", symbol],
    queryFn: () => stocksApi.getInfo(symbol).then((r) => r.data.data),
    staleTime: 5 * 60_000,
    enabled: !!symbol,
  });
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => stocksApi.search(query).then((r) => r.data.results),
    enabled: query.length >= 1,
    staleTime: 60_000,
  });
}

export function usePopularStocks() {
  return useQuery({
    queryKey: ["popular"],
    queryFn: () => stocksApi.getPopular().then((r) => r.data),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useCategoryStocks(category: string) {
  return useQuery({
    queryKey: ["category-stocks", category],
    queryFn: () => stocksApi.getCategory(category).then((r) => r.data),
    refetchInterval: 45_000,
    staleTime: 20_000,
    enabled: !!category,
  });
}

// ====== LSX Hooks ======
export function useLSXMarket() {
  return useQuery({
    queryKey: ["lsx-market"],
    queryFn: () => lsxApi.getMarket().then((r) => r.data.data),
    refetchInterval: 15 * 60_000,
    staleTime: 10 * 60_000,
  });
}

export function useLSXStocks() {
  return useQuery({
    queryKey: ["lsx-stocks"],
    queryFn: () => lsxApi.getStocks().then((r) => r.data.data),
    refetchInterval: 15 * 60_000,
    staleTime: 10 * 60_000,
  });
}

export function useLSXHistory(symbol: string) {
  return useQuery({
    queryKey: ["lsx-history", symbol],
    queryFn: () => lsxApi.getHistory(symbol).then((r) => r.data.data),
    enabled: !!symbol,
    staleTime: 10 * 60_000,
  });
}

// ====== Indicator Hooks ======
export function useIndicators(
  symbol: string,
  period = "6mo",
  interval = "1d",
  indicators = "RSI,MACD,BB,MA"
) {
  return useQuery({
    queryKey: ["indicators", symbol, period, interval, indicators],
    queryFn: () =>
      indicatorsApi.get(symbol, { period, interval, indicators }).then((r) => r.data.data),
    enabled: !!symbol,
    staleTime: 60_000,
  });
}

export function useStockAnalysis(symbol: string, period = "1y") {
  return useQuery({
    queryKey: ["analysis", symbol, period],
    queryFn: () =>
      indicatorsApi.getAnalysis(symbol, period).then((r) => r.data.data),
    enabled: !!symbol,
    staleTime: 60_000,
  });
}

// ====== Watchlist Hooks ======
export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: () => watchlistApi.get().then((r) => r.data.data),
  });
}

export function useAddToWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ symbol, source }: { symbol: string; source?: string }) =>
      watchlistApi.add(symbol, source).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => watchlistApi.remove(id).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}
