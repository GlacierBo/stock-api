import { defineStore } from "pinia";

const STORAGE_KEY = "stock-theme";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
  }),
  actions: {
    init() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.isDark = stored === "dark";
      } else {
        this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      this.apply();
    },
    toggle() {
      this.isDark = !this.isDark;
      this.apply();
    },
    apply() {
      const theme = this.isDark ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.classList.toggle("dark", this.isDark);
      localStorage.setItem(STORAGE_KEY, theme);
    },
  },
});
