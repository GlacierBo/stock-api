<script setup lang="ts">
import { ref, onUnmounted } from "vue";

const emit = defineEmits<{
  search: [keyword: string];
}>();

const keyword = ref("");
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function handleSearch() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (keyword.value.trim()) {
    emit("search", keyword.value.trim());
  }
}

function handleInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    if (keyword.value.trim()) {
      emit("search", keyword.value.trim());
    }
    debounceTimer = null;
  }, 500);
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    handleSearch();
  }
}

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        v-model="keyword"
        type="text"
        placeholder="输入股票代码或名称，如 SH510500、格力电器"
        class="search-input"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <button class="search-button" @click="handleSearch">
        搜索
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 16px;
}

.search-input-wrapper {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #667eea;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-button {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.search-button:hover {
  opacity: 0.9;
}
</style>
