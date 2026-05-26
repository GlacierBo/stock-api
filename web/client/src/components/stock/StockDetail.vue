<script setup lang="ts">
import type { Stock } from "../../../../shared/types";
import PriceTag from "./PriceTag.vue";
import { formatPrice } from "@/composables/usePriceFormat";

defineProps<{
  stock: Stock;
}>();
</script>

<template>
  <div class="stock-detail">
    <div class="detail-header">
      <div>
        <h2 class="detail-name">{{ stock.name }}</h2>
        <span class="detail-code">{{ stock.code }}</span>
      </div>
      <PriceTag :now="stock.now" :percent="stock.percent" size="large" />
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <span class="item-label">昨收</span>
        <span class="item-value">{{ formatPrice(stock.yesterday) }}</span>
      </div>
      <div class="detail-item">
        <span class="item-label">最高</span>
        <span class="item-value price-up">{{ formatPrice(stock.high) }}</span>
      </div>
      <div class="detail-item">
        <span class="item-label">最低</span>
        <span class="item-value price-down">{{ formatPrice(stock.low) }}</span>
      </div>
      <div class="detail-item">
        <span class="item-label">数据源</span>
        <span class="item-value">{{ stock.source || "--" }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stock-detail {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-md);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.detail-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.detail-code {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.item-value {
  font-size: 18px;
  font-weight: 500;
  font-family: monospace;
}

@media (min-width: 640px) {
  .detail-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
