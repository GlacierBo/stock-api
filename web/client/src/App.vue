<script setup lang="ts">
import { ref } from "vue";
import type { Stock, StockSource } from "../../shared/types";
import SearchBar from "./components/SearchBar.vue";
import DataSourceSwitch from "./components/DataSourceSwitch.vue";
import StockList from "./components/StockList.vue";
import StockDetail from "./components/StockDetail.vue";
import { searchStocks } from "./api/stocks";

const stocks = ref<Stock[]>([]);
const loading = ref(false);
const error = ref("");
const currentSource = ref<StockSource>("auto");
const selectedStock = ref<Stock | null>(null);
const showDetail = ref(false);

async function handleSearch(keyword: string) {
  if (!keyword.trim()) return;

  loading.value = true;
  error.value = "";

  try {
    stocks.value = await searchStocks(keyword, currentSource.value);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Search failed";
    stocks.value = [];
  } finally {
    loading.value = false;
  }
}

function handleSourceChange(source: StockSource) {
  currentSource.value = source;
}

function handleStockClick(stock: Stock) {
  selectedStock.value = stock;
  showDetail.value = true;
}

function handleCloseDetail() {
  showDetail.value = false;
  selectedStock.value = null;
}
</script>

<template>
  <div class="app">
    <header>
      <div class="container">
        <h1>Stock API</h1>
        <p>支持 A 股、港股、美股行情查询</p>
      </div>
    </header>

    <main class="container">
      <div class="search-section">
        <SearchBar @search="handleSearch" />
        <DataSourceSwitch :source="currentSource" @change="handleSourceChange" />
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <StockList :stocks="stocks" :loading="loading" @stock-click="handleStockClick" />

      <StockDetail
        v-if="showDetail && selectedStock"
        :stock="selectedStock"
        @close="handleCloseDetail"
      />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

.search-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
