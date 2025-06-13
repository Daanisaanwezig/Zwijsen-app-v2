<script setup lang="ts">
defineProps<{
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}>()
</script>

<template>
  <span class="badge" :class="`badge--${type || 'primary'}`">
    <slot />
  </span>
</template>

<style lang="scss">
.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 600;
  
  &--primary {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }
  
  &--secondary {
    background-color: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-secondary);
  }
  
  &--success {
    background-color: var(--md-sys-color-green);
    color: var(--text-on-dark);
  }
  
  &--warning {
    background-color: var(--md-sys-color-orange);
    color: var(--text-on-dark);
  }
  
  &--error {
    background-color: var(--md-sys-color-red);
    color: var(--text-on-dark);
  }
}
</style>
