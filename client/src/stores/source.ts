import { defineStore } from "pinia";
import type { StockSource } from "@shared/types";

const STORAGE_KEY = "stock-source";

export const useSourceStore = defineStore("source", {
  state: () => ({
    current: "auto" as StockSource,
  }),
  actions: {
    init() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ["auto", "tencent", "sina", "eastmoney"].includes(stored)) {
        this.current = stored as StockSource;
      }
    },
    setSource(source: StockSource) {
      this.current = source;
      localStorage.setItem(STORAGE_KEY, source);
    },
  },
});
