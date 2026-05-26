<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Stock } from "../../../shared/types";
import { useStocksStore } from "@/stores/stocks";
import SearchBar from "@/components/search/SearchBar.vue";
import StockGrid from "@/components/stock/StockGrid.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";

const router = useRouter();
const stocksStore = useStocksStore();

function handleStockClick(stock: Stock) {
  router.push({ name: "stock-detail", params: { code: stock.code } });
}

function handleRetry() {
  stocksStore.clearError();
  if (stocksStore.lastKeyword) {
    stocksStore.search(stocksStore.lastKeyword);
  }
}
</script>

<template>
  <div class="home-page">
    <div class="search-section">
      <SearchBar />
    </div>

    <ErrorMessage
      v-if="stocksStore.error"
      :message="stocksStore.error"
      @retry="handleRetry"
    />

    <LoadingSpinner v-if="stocksStore.loading" />

    <template v-else-if="!stocksStore.error">
      <EmptyState
        v-if="stocksStore.results.length === 0"
        :message="stocksStore.lastKeyword ? '未找到相关股票' : '输入股票代码或名称开始搜索'"
      />
      <StockGrid
        v-else
        :stocks="stocksStore.results"
        @stock-click="handleStockClick"
      />
    </template>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}
</style>
