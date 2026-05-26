import { defineStore } from "pinia";
import type { Stock } from "../../../shared/types";
import { searchStocks, getStock } from "@/api/stocks";
import { useSourceStore } from "./source";

export const useStocksStore = defineStore("stocks", {
  state: () => ({
    results: [] as Stock[],
    selected: null as Stock | null,
    loading: false,
    error: "",
    lastKeyword: "",
  }),
  actions: {
    async search(keyword: string) {
      if (!keyword.trim()) return;
      const sourceStore = useSourceStore();
      this.loading = true;
      this.error = "";
      this.lastKeyword = keyword;
      try {
        this.results = await searchStocks(keyword, sourceStore.current);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "搜索失败";
        this.results = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchStock(code: string) {
      const sourceStore = useSourceStore();
      this.loading = true;
      this.error = "";
      try {
        this.selected = await getStock(code, sourceStore.current);
      } catch (err) {
        this.error = err instanceof Error ? err.message : "查询失败";
        this.selected = null;
      } finally {
        this.loading = false;
      }
    },
    clearResults() {
      this.results = [];
      this.lastKeyword = "";
    },
    clearError() {
      this.error = "";
    },
  },
});
