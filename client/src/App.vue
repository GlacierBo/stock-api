<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "./stores/theme";
import AppHeader from "./components/layout/AppHeader.vue";

const themeStore = useThemeStore();
const theme = computed(() => (themeStore.isDark ? "dark" : "light"));
</script>

<template>
  <div class="app" :data-theme="theme">
    <AppHeader />
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}

main {
  padding-top: 24px;
  padding-bottom: 48px;
}
</style>
