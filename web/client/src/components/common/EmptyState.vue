<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<template>
  <div class="empty-state">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 6-10" />
    </svg>
    <p class="empty-text">{{ message || "输入股票代码或名称开始搜索" }}</p>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  gap: 16px;
}

.empty-text {
  font-size: 15px;
  color: var(--color-text-secondary);
}
</style>
