<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="not-found">
    <h1 class="title">404</h1>
    <p class="message">页面不存在</p>
    <el-button type="primary" @click="router.push('/')">
      返回首页
    </el-button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
}

.title {
  font-size: 64px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.message {
  font-size: 18px;
  color: var(--color-text-secondary);
}
</style>
