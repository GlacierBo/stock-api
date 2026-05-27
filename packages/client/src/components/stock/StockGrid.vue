<script setup lang="ts">
import type { Stock } from "@shared/types";
import StockCard from "./StockCard.vue";

defineProps<{
  stocks: Stock[];
}>();

const emit = defineEmits<{
  "stock-click": [stock: Stock];
}>();
</script>

<template>
  <div class="stock-grid">
    <StockCard
      v-for="stock in stocks"
      :key="stock.code"
      :stock="stock"
      @click="emit('stock-click', stock)"
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
