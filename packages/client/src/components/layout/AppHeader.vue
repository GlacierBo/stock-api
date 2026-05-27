<script setup lang="ts">
import { useRouter } from "vue-router";
import ThemeToggle from "@/components/common/ThemeToggle.vue";
import DataSourceSwitch from "@/components/common/DataSourceSwitch.vue";

const router = useRouter();
</script>

<template>
  <header class="app-header">
    <div class="header-content container">
      <div class="header-left" @click="router.push('/')">
        <h1 class="header-title">Stock API</h1>
        <span class="header-subtitle">股票行情查询</span>
      </div>
      <div class="header-right">
        <DataSourceSwitch />
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
  cursor: pointer;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.header-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
