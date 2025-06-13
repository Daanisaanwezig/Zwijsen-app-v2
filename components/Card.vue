<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'outline' | 'elevated';
}>()
</script>

<template>
  <div class="card" :class="`card--${variant || 'default'}`">
    <slot />
  </div>
</template>

<style lang="scss">
.card {
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  
  &--default {
    background-color: #fff;
    box-shadow: var(--shadow-sm);
  }
  
  &--outline {
    background-color: transparent;
    border: 1px solid var(--md-sys-color-outline);
  }
  
  &--elevated {
    background-color: #fff;
    box-shadow: var(--shadow-md);
  }
}
</style>
