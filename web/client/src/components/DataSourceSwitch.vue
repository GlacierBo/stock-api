<script setup lang="ts">
import type { StockSource } from "../../../shared/types";

const props = defineProps<{
  source: StockSource;
}>();

const emit = defineEmits<{
  change: [source: StockSource];
}>();

const sources: { value: StockSource; label: string }[] = [
  { value: "auto", label: "自动" },
  { value: "tencent", label: "腾讯" },
  { value: "sina", label: "新浪" },
  { value: "eastmoney", label: "东方财富" },
];

function handleChange(source: StockSource) {
  emit("change", source);
}
</script>

<template>
  <div class="data-source-switch">
    <span class="label">数据源：</span>
    <div class="switch-group">
      <button
        v-for="item in sources"
        :key="item.value"
        class="switch-button"
        :class="{ active: props.source === item.value }"
        @click="handleChange(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.data-source-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.label {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

.switch-group {
  display: flex;
  gap: 8px;
}

.switch-button {
  padding: 8px 16px;
  font-size: 14px;
  color: #4b5563;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.switch-button:hover {
  background: #e5e7eb;
}

.switch-button.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
}
</style>
