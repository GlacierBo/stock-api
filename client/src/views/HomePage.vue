<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import type { Stock } from "@shared/types";
import { useStocksStore } from "@/stores/stocks";
import { useWatchlistStore } from "@/stores/watchlist";
import SearchBar from "@/components/search/SearchBar.vue";
import StockGrid from "@/components/stock/StockGrid.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import EmptyState from "@/components/common/EmptyState.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import WatchlistPanel from "@/components/watchlist/WatchlistPanel.vue";

const router = useRouter();
const stocksStore = useStocksStore();
const watchlistStore = useWatchlistStore();

onMounted(() => {
  if (watchlistStore.items.length > 0) {
    watchlistStore.startPolling();
  }
});

onUnmounted(() => {
  watchlistStore.stopPolling();
});

function handleStockClick(stock: Stock) {
  router.push({ name: "stock-detail", params: { code: stock.code } });
}

function handleToggleWatch(stock: Stock) {
  if (watchlistStore.isWatched(stock.code)) {
    watchlistStore.remove(stock.code);
  } else {
    watchlistStore.add(stock);
    if (!watchlistStore._timer) {
      watchlistStore.startPolling();
    }
  }
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

    <WatchlistPanel />

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
        :watched-codes="watchlistStore.codes"
        @stock-click="handleStockClick"
        @toggle-watch="handleToggleWatch"
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
