import { defineStore } from "pinia";
import type { Stock, StockSource } from "@shared/types";
import { getStocksBatch } from "@/api/stocks";
import { useSourceStore } from "./source";

export interface PriceRecord {
  price: number;
  time: string;
}

export interface WatchlistItem {
  code: string;
  name: string;
  basePrice: number;
  latestPrice: number;
  lastUpdated: string;
  priceHistory: PriceRecord[];
}

const STORAGE_KEY = "stock-watchlist";
const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

function loadFromStorage(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToStorage(items: WatchlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const useWatchlistStore = defineStore("watchlist", {
  state: () => ({
    items: loadFromStorage() as WatchlistItem[],
    loading: false,
    error: "",
    lastRefreshed: null as string | null,
    _timer: null as ReturnType<typeof setInterval> | null,
  }),

  getters: {
    codes: (state) => state.items.map((i) => i.code),
    isWatched: (state) => (code: string) => state.items.some((i) => i.code === code),
  },

  actions: {
    add(stock: Stock) {
      if (this.items.some((i) => i.code === stock.code)) return;
      const item: WatchlistItem = {
        code: stock.code,
        name: stock.name,
        basePrice: stock.yesterday,
        latestPrice: stock.now,
        lastUpdated: new Date().toISOString(),
        priceHistory: [{ price: stock.now, time: new Date().toISOString() }],
      };
      this.items.push(item);
      saveToStorage(this.items);
    },

    remove(code: string) {
      this.items = this.items.filter((i) => i.code !== code);
      saveToStorage(this.items);
      if (this.items.length === 0) {
        this.stopPolling();
      }
    },

    async refresh() {
      if (this.items.length === 0) return;
      const sourceStore = useSourceStore();
      this.loading = true;
      this.error = "";
      try {
        const codes = this.items.map((i) => i.code);
        const stocks = await getStocksBatch(codes, sourceStore.current);
        const now = new Date().toISOString();
        const stockMap = new Map(stocks.map((s) => [s.code, s]));
        for (const item of this.items) {
          const stock = stockMap.get(item.code);
          if (stock) {
            item.latestPrice = stock.now;
            item.lastUpdated = now;
            item.priceHistory.push({ price: stock.now, time: now });
            // keep last 100 records
            if (item.priceHistory.length > 100) {
              item.priceHistory = item.priceHistory.slice(-100);
            }
          }
        }
        this.lastRefreshed = now;
        saveToStorage(this.items);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "刷新失败";
      } finally {
        this.loading = false;
      }
    },

    startPolling() {
      this.stopPolling();
      this.refresh();
      this._timer = setInterval(() => this.refresh(), POLL_INTERVAL);
    },

    stopPolling() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    },
  },
});
