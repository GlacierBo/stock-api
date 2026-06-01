<script setup lang="ts">
import type { StockSource } from "@shared/types";
import { useSourceStore } from "@/stores/source";

const sourceStore = useSourceStore();

const options: { label: string; value: StockSource }[] = [
  { label: "自动", value: "auto" },
  { label: "腾讯", value: "tencent" },
  { label: "新浪", value: "sina" },
  { label: "东方财富", value: "eastmoney" },
];
</script>

<template>
  <div class="source-switch">
    <span class="switch-label">数据源</span>
    <div class="switch-group">
      <button
        v-for="opt in options"
        :key="opt.value"
        :class="['switch-btn', { active: sourceStore.current === opt.value }]"
        @click="sourceStore.setSource(opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.source-switch {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-label {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.switch-group {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.switch-btn {
  padding: 6px 14px;
  font-size: 13px;
  border: none;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.switch-btn:not(:last-child) {
  border-right: 1px solid var(--color-border);
}

.switch-btn:hover {
  background: var(--color-bg);
}

.switch-btn.active {
  background: var(--color-primary);
  color: #fff;
}
</style>
