<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useStocksStore } from "@/stores/stocks";
import StockDetail from "@/components/stock/StockDetail.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";

const props = defineProps<{
  code: string;
}>();

const router = useRouter();
const stocksStore = useStocksStore();

onMounted(() => {
  stocksStore.fetchStock(props.code);
});

function handleRetry() {
  stocksStore.clearError();
  stocksStore.fetchStock(props.code);
}
</script>

<template>
  <div class="detail-page">
    <div class="page-header">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
    </div>

    <LoadingSpinner v-if="stocksStore.loading" />

    <ErrorMessage
      v-else-if="stocksStore.error"
      :message="stocksStore.error"
      @retry="handleRetry"
    />

    <StockDetail
      v-else-if="stocksStore.selected"
      :stock="stocksStore.selected"
    />
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  display: flex;
  align-items: center;
}
</style>
