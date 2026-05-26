<script setup lang="ts">
import type { Stock } from "../../../../shared/types";
import PriceTag from "./PriceTag.vue";
import { formatPrice, getPriceBgClass } from "@/composables/usePriceFormat";

const props = defineProps<{
  stock: Stock;
}>();

const emit = defineEmits<{
  click: [stock: Stock];
}>();
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
</style>
