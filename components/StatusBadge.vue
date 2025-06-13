<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{
  status: 'success' | 'warning' | 'error' | 'info' | 'processing';
  text?: string;
}>()

const statusText = computed(() => {
  if (props.text) return props.text;
  
  switch (props.status) {
    case 'success': return 'Voltooid';
    case 'warning': return 'Let op';
    case 'error': return 'Fout';
    case 'info': return 'Info';
    case 'processing': return 'Bezig';
    default: return '';
  }
});
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    <span class="status-badge__icon"></span>
    <span class="status-badge__text">{{ statusText }}</span>
  </span>
</template>

<style lang="scss">
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 500;
  
  &__icon {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }
  
  &__text {
    line-height: 1;
  }
  
  &--success {
    background-color: rgba(150, 195, 30, 0.15);
    color: var(--md-sys-color-green);
    
    .status-badge__icon {
      background-color: var(--md-sys-color-green);
    }
  }
  
  &--warning {
    background-color: rgba(235, 90, 11, 0.15);
    color: var(--md-sys-color-orange);
    
    .status-badge__icon {
      background-color: var(--md-sys-color-orange);
    }
  }
  
  &--error {
    background-color: rgba(225, 4, 19, 0.15);
    color: var(--md-sys-color-red);
    
    .status-badge__icon {
      background-color: var(--md-sys-color-red);
    }
  }
  
  &--info {
    background-color: rgba(1, 160, 226, 0.15);
    color: var(--md-sys-color-primary);
    
    .status-badge__icon {
      background-color: var(--md-sys-color-primary);
    }
  }
  
  &--processing {
    background-color: rgba(150, 25, 129, 0.15);
    color: var(--md-sys-color-secondary);
    
    .status-badge__icon {
      background-color: var(--md-sys-color-secondary);
    }
  }
}
</style>
