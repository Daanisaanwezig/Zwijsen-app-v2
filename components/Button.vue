<script setup lang="ts">
const props = defineProps<{
  type?: 'primary' | 'secondary' | 'light' | 'orange' | 'green' | 'red';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}>()

// Default values
const buttonType = props.type || 'primary'
const buttonSize = props.size || 'md'
</script>

<template>
  <button 
    :class="[
      'btn', 
      `btn--${buttonType}`, 
      `btn--${buttonSize}`, 
      { 'btn--full-width': fullWidth }
    ]" 
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: var(--shadow-sm);
  font-family: var(--font-body);
  margin: var(--spacing-sm);

  &:hover:not(:disabled) {
    filter: brightness(1.05);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    filter: brightness(0.95);
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Button types */
  &--primary {
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
  }

  &--secondary {
    background-color: var(--md-sys-color-secondary);
    color: var(--md-sys-color-on-secondary);
  }

  &--light {
    background-color: var(--md-sys-color-surface);
    color: var(--md-sys-color-on-surface);
    border: 1px solid var(--md-sys-color-outline);
  }

  &--orange {
    background-color: var(--md-sys-color-orange);
    color: var(--text-on-dark);
  }

  &--green {
    background-color: var(--md-sys-color-green);
    color: var(--text-on-dark);
  }

  &--red {
    background-color: var(--md-sys-color-red);
    color: var(--text-on-dark);
  }

  /* Button sizes */
  &--sm {
    padding: 8px 16px;
    font-size: 14px;
  }

  &--md {
    padding: 12px 24px;
    font-size: 16px;
  }

  &--lg {
    padding: 16px 32px;
    font-size: 18px;
  }

  /* Full width */
  &--full-width {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
