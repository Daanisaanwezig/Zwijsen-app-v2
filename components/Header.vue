<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  backButton?: boolean;
  centered?: boolean;
  backTo?: string; // New prop to specify where to navigate back to
}>()

const goBack = () => {
  if (props.backTo) {
    router.push(props.backTo);
  } else {
    router.back();
  }
};
</script>

<template>
  <header class="header" :class="{ 'header--centered': centered }">
    <button v-if="backButton" class="header__back" aria-label="Terug" @click="goBack">
      <span class="header__back-icon">←</span>
    </button>
    <h2 class="header__title">
      <slot />
    </h2>
  </header>
</template>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--md-sys-color-surface);
  color: var(--md-sys-color-on-surface);
  border-bottom: 1px solid var(--md-sys-color-outline);
  position: relative;
  box-shadow: var(--shadow-sm);

  &--centered {
    justify-content: center;
  }

  &__back {
    position: absolute;
    left: var(--spacing-md);
    background: none;
    border: none;
    color: var(--md-sys-color-primary);
    font-size: 20px;
    font-weight: 600;
    font-family: var(--font-body);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(1, 160, 226, 0.1);
    }

    &:focus {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 2px;
    }
  }

  &__back-icon {
    font-size: 24px;
    line-height: 1;
  }

  &__title {
    font-family: var(--font-heading);
    flex: 1;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    margin: 0;
    color: var(--md-sys-color-primary);
  }
}
</style>
