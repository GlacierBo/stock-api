<script setup lang="ts">
import { Search } from "@element-plus/icons-vue";
import { useStockSearch } from "@/composables/useStockSearch";

const { keyword, onInput, onSubmit } = useStockSearch();

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    onSubmit();
  }
}
</script>

<template>
  <div class="search-bar">
    <el-input
      v-model="keyword"
      placeholder="输入股票代码或名称，如 SH510500、格力电器"
      size="large"
      clearable
      @input="onInput"
      @keydown="handleKeydown"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>
    <el-button type="primary" size="large" @click="onSubmit">
      搜索
    </el-button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
}

.search-bar :deep(.el-input) {
  flex: 1;
}
</style>
