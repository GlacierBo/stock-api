<script setup lang="ts">
defineProps<{
  message: string;
}>();

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="error-message">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
    <span class="error-text">{{ message }}</span>
    <button class="retry-btn" @click="emit('retry')">重试</button>
  </div>
</template>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-up-bg);
  color: var(--color-up);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
}

.error-text {
  flex: 1;
}

.retry-btn {
  padding: 4px 16px;
  border: 1px solid var(--color-up);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-up);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: var(--color-up);
  color: #fff;
}
</style>
