<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useWatchlistStore } from "@/stores/watchlist";
import {
  formatPrice,
  formatPercent,
  getPriceClass,
  getPriceBgClass,
} from "@/composables/usePriceFormat";

const router = useRouter();
const watchlistStore = useWatchlistStore();

const lastUpdatedText = computed(() => {
  if (!watchlistStore.lastRefreshed) return "";
  const d = new Date(watchlistStore.lastRefreshed);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
});

function getChange(item: { latestPrice: number; basePrice: number }) {
  return item.latestPrice - item.basePrice;
}

function getChangePercent(item: { latestPrice: number; basePrice: number }) {
  if (!item.basePrice) return 0;
  return (item.latestPrice - item.basePrice) / item.basePrice;
}

function handleClick(code: string) {
  router.push({ name: "stock-detail", params: { code } });
}

function handleRemove(e: Event, code: string) {
  e.stopPropagation();
  watchlistStore.remove(code);
}
</script>

<template>
  <div class="watchlist-panel" v-if="watchlistStore.items.length > 0">
    <div class="panel-header">
      <h3 class="panel-title">
        <svg class="star-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        我的自选
        <span class="count">{{ watchlistStore.items.length }}</span>
      </h3>
      <div class="panel-meta">
        <span v-if="watchlistStore.loading" class="refreshing">刷新中...</span>
        <span v-else-if="lastUpdatedText" class="update-time">
          上次更新 {{ lastUpdatedText }}
        </span>
      </div>
    </div>

    <div class="watchlist-list">
      <div
        v-for="item in watchlistStore.items"
        :key="item.code"
        :class="['watchlist-item', getPriceBgClass(getChangePercent(item))]"
        @click="handleClick(item.code)"
      >
        <div class="item-main">
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-code">{{ item.code }}</span>
          </div>
          <div class="item-price">
            <span class="price-value">{{ formatPrice(item.latestPrice) }}</span>
            <span :class="['change-value', getPriceClass(getChangePercent(item))]">
              {{ formatPrice(getChange(item)) }}
              ({{ formatPercent(getChangePercent(item)) }})
            </span>
          </div>
        </div>
        <button class="remove-btn" title="取消自选" @click="handleRemove($event, item.code)">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.watchlist-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.star-icon {
  color: #f59e0b;
}

.count {
  background: var(--color-primary);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.panel-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.refreshing {
  color: var(--color-primary);
}

.watchlist-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.watchlist-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
  border-left: 3px solid transparent;
}

.watchlist-item:hover {
  background: var(--color-bg);
}

.watchlist-item.price-up-bg {
  border-left-color: var(--color-up);
}

.watchlist-item.price-down-bg {
  border-left-color: var(--color-down);
}

.item-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.item-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-code {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: monospace;
  white-space: nowrap;
}

.item-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
}

.price-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  font-family: monospace;
}

.change-value {
  font-size: 12px;
  font-family: monospace;
}

.price-up {
  color: var(--color-up);
}

.price-down {
  color: var(--color-down);
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  margin-left: 8px;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.remove-btn:hover {
  color: var(--color-up);
  background: var(--color-up-bg);
}
</style>
