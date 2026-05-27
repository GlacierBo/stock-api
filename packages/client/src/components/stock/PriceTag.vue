<script setup lang="ts">
import { formatPrice, formatPercent, getPriceClass } from "@/composables/usePriceFormat";

defineProps<{
  now: number;
  percent: number;
  size?: "small" | "medium" | "large";
}>();
</script>

<template>
  <div :class="['price-tag', size || 'medium']">
    <span :class="['price-value', getPriceClass(percent)]">
      {{ formatPrice(now) }}
    </span>
    <span :class="['percent-badge', getPriceClass(percent)]">
      {{ formatPercent(percent) }}
    </span>
  </div>
</template>

<style scoped>
.price-tag {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price-value {
  font-weight: 600;
}

.percent-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
}

.price-tag.small .price-value {
  font-size: 14px;
}

.price-tag.small .percent-badge {
  font-size: 12px;
}

.price-tag.medium .price-value {
  font-size: 18px;
}

.price-tag.medium .percent-badge {
  font-size: 13px;
}

.price-tag.large .price-value {
  font-size: 36px;
}

.price-tag.large .percent-badge {
  font-size: 16px;
  padding: 4px 12px;
}

.price-up {
  color: var(--color-up);
}

.price-down {
  color: var(--color-down);
}

.price-up.percent-badge {
  background: var(--color-up-bg);
}

.price-down.percent-badge {
  background: var(--color-down-bg);
}
</style>
