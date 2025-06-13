<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}>()
</script>

<template>
  <div 
    class="loading-spinner" 
    :class="{
      'loading-spinner--sm': size === 'sm',
      'loading-spinner--lg': size === 'lg'
    }"
    :style="{ borderLeftColor: color }"
  ></div>
</template>

<style lang="scss">
.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--md-sys-color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  
  &--sm {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }
  
  &--lg {
    width: 48px;
    height: 48px;
    border-width: 4px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
