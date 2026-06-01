<script setup lang="ts">
import type { Stock } from "@shared/types";
import StockCard from "./StockCard.vue";

defineProps<{
  stocks: Stock[];
  watchedCodes?: string[];
}>();

const emit = defineEmits<{
  "stock-click": [stock: Stock];
  "toggle-watch": [stock: Stock];
}>();
</script>

<template>
  <div class="stock-grid">
    <StockCard
      v-for="stock in stocks"
      :key="stock.code"
      :stock="stock"
      :is-watched="watchedCodes?.includes(stock.code) ?? false"
      @click="emit('stock-click', stock)"
      @toggle-watch="emit('toggle-watch', $event)"
    />
  </div>
</template>

<style scoped>
.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>
