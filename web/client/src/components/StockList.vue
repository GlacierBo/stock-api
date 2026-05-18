<script setup lang="ts">
import type { Stock } from "../../../shared/types";
import StockCard from "./StockCard.vue";

const props = defineProps<{
  stocks: Stock[];
  loading: boolean;
}>();

const emit = defineEmits<{
  stockClick: [stock: Stock];
}>();

function handleStockClick(stock: Stock) {
  emit("stockClick", stock);
}
</script>

<template>
  <div class="stock-list">
    <div v-if="props.loading" class="loading-state">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else-if="props.stocks.length === 0" class="empty-state">
      <div class="empty-icon">📈</div>
      <div class="empty-text">输入股票代码或名称开始搜索</div>
    </div>

    <div v-else class="stock-grid">
      <StockCard
        v-for="stock in props.stocks"
        :key="stock.code"
        :stock="stock"
        @click="handleStockClick"
      />
    </div>
  </div>
</template>

<style scoped>
.stock-list {
  min-height: 300px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 300px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
</style>
