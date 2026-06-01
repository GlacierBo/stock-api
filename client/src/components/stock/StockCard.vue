<script setup lang="ts">
import type { Stock } from "@shared/types";
import PriceTag from "./PriceTag.vue";
import { formatPrice, getPriceBgClass } from "@/composables/usePriceFormat";

const props = defineProps<{
  stock: Stock;
  isWatched?: boolean;
}>();

const emit = defineEmits<{
  click: [stock: Stock];
  "toggle-watch": [stock: Stock];
}>();

function handleToggleWatch(e: Event) {
  e.stopPropagation();
  emit("toggle-watch", props.stock);
}
</script>

<template>
  <div
    :class="['stock-card', getPriceBgClass(stock.percent)]"
    @click="emit('click', stock)"
  >
    <div class="card-header">
      <div class="stock-info">
        <span class="stock-name">{{ stock.name }}</span>
        <span class="stock-code">{{ stock.code }}</span>
      </div>
      <button
        :class="['watch-btn', { watched: isWatched }]"
        :title="isWatched ? '取消自选' : '加自选'"
        @click="handleToggleWatch"
      >
        <svg v-if="isWatched" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </button>
    </div>
    <div class="card-body">
      <PriceTag :now="stock.now" :percent="stock.percent" size="medium" />
    </div>
    <div class="card-footer">
      <div class="range">
        <span class="range-label">最高</span>
        <span class="range-value">{{ formatPrice(stock.high) }}</span>
      </div>
      <div class="range">
        <span class="range-label">最低</span>
        <span class="range-value">{{ formatPrice(stock.low) }}</span>
      </div>
      <div v-if="stock.source" class="source-tag">
        {{ stock.source }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-sm);
}

.stock-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stock-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stock-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.stock-code {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.card-body {
  margin-bottom: 12px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
}

.range {
  display: flex;
  gap: 4px;
}

.range-label {
  color: var(--color-text-secondary);
}

.range-value {
  color: var(--color-text);
  font-family: monospace;
}

.source-tag {
  margin-left: auto;
  padding: 2px 8px;
  background: var(--color-bg);
  border-radius: 4px;
  font-size: 11px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.watch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 6px;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.watch-btn:hover {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.watch-btn.watched {
  color: #f59e0b;
}
</style>
