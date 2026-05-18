<script setup lang="ts">
import type { Stock } from "../../../shared/types";

const props = defineProps<{
  stock: Stock;
}>();

const emit = defineEmits<{
  click: [stock: Stock];
}>();

function formatPercent(percent: number): string {
  const value = (percent * 100).toFixed(2);
  return percent >= 0 ? `+${value}%` : `${value}%`;
}

function formatPrice(price: number): string {
  return price.toFixed(2);
}

function handleClick() {
  emit("click", props.stock);
}
</script>

<template>
  <div class="stock-card" @click="handleClick">
    <div class="card-header">
      <div class="stock-name">{{ stock.name }}</div>
      <div class="stock-code">{{ stock.code }}</div>
    </div>
    <div class="card-body">
      <div class="price-section">
        <div class="current-price" :class="{ up: stock.percent >= 0, down: stock.percent < 0 }">
          {{ formatPrice(stock.now) }}
        </div>
        <div class="percent" :class="{ up: stock.percent >= 0, down: stock.percent < 0 }">
          {{ formatPercent(stock.percent) }}
        </div>
      </div>
      <div class="price-range">
        <div class="range-item">
          <span class="range-label">最高</span>
          <span class="range-value">{{ formatPrice(stock.high) }}</span>
        </div>
        <div class="range-item">
          <span class="range-label">最低</span>
          <span class="range-value">{{ formatPrice(stock.low) }}</span>
        </div>
      </div>
    </div>
    <div v-if="stock.source" class="card-footer">
      <span class="source-tag">{{ stock.source }}</span>
    </div>
  </div>
</template>

<style scoped>
.stock-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stock-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  margin-bottom: 16px;
}

.stock-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.stock-code {
  font-size: 13px;
  color: #6b7280;
}

.card-body {
  margin-bottom: 12px;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
}

.current-price.up {
  color: #dc2626;
}

.current-price.down {
  color: #16a34a;
}

.percent {
  font-size: 16px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.percent.up {
  color: #dc2626;
  background: #fef2f2;
}

.percent.down {
  color: #16a34a;
  background: #f0fdf4;
}

.price-range {
  display: flex;
  gap: 16px;
}

.range-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.range-label {
  font-size: 12px;
  color: #9ca3af;
}

.range-value {
  font-size: 14px;
  color: #4b5563;
}

.card-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 12px;
}

.source-tag {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
