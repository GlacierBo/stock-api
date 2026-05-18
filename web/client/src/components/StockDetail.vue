<script setup lang="ts">
import type { Stock } from "../../../shared/types";

const props = defineProps<{
  stock: Stock;
}>();

const emit = defineEmits<{
  close: [];
}>();

function formatPercent(percent: number): string {
  const value = (percent * 100).toFixed(2);
  return percent >= 0 ? `+${value}%` : `${value}%`;
}

function formatPrice(price: number): string {
  return price.toFixed(2);
}

function handleClose() {
  emit("close");
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    handleClose();
  }
}
</script>

<template>
  <div class="detail-overlay" @click="handleBackdropClick">
    <div class="detail-modal">
      <div class="modal-header">
        <h2>{{ stock.name }}</h2>
        <button class="close-button" @click="handleClose">&times;</button>
      </div>

      <div class="modal-body">
        <div class="stock-code">{{ stock.code }}</div>

        <div class="price-section">
          <div class="current-price" :class="{ up: stock.percent >= 0, down: stock.percent < 0 }">
            {{ formatPrice(stock.now) }}
          </div>
          <div class="percent" :class="{ up: stock.percent >= 0, down: stock.percent < 0 }">
            {{ formatPercent(stock.percent) }}
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">昨收</span>
            <span class="info-value">{{ formatPrice(stock.yesterday) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最高</span>
            <span class="info-value">{{ formatPrice(stock.high) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">最低</span>
            <span class="info-value">{{ formatPrice(stock.low) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">数据来源</span>
            <span class="info-value">{{ stock.source || "N/A" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.close-button {
  width: 36px;
  height: 36px;
  font-size: 24px;
  color: #6b7280;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-button:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.modal-body {
  padding: 24px;
}

.stock-code {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.current-price {
  font-size: 48px;
  font-weight: 700;
}

.current-price.up {
  color: #dc2626;
}

.current-price.down {
  color: #16a34a;
}

.percent {
  font-size: 20px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 6px;
}

.percent.up {
  color: #dc2626;
  background: #fef2f2;
}

.percent.down {
  color: #16a34a;
  background: #f0fdf4;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 13px;
  color: #9ca3af;
}

.info-value {
  font-size: 18px;
  font-weight: 500;
  color: #1f2937;
}
</style>
