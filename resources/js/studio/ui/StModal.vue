<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';

const props = defineProps<{ open: boolean; title?: string }>();
const emit = defineEmits<{ close: [] }>();

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', onKeydown);
    } else {
      window.removeEventListener('keydown', onKeydown);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="st-modal">
      <div class="st-modal__overlay" @click="$emit('close')"></div>
      <div class="st-modal__panel" role="dialog" aria-modal="true" :aria-label="title">
        <header v-if="title" class="st-modal__header">
          <span>{{ title }}</span>
          <button type="button" class="st-modal__close" aria-label="Close" @click="$emit('close')">
            ✕
          </button>
        </header>
        <div class="st-modal__body">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.st-modal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.st-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.st-modal__panel {
  position: relative;
  width: min(480px, calc(100vw - 32px));
  background: var(--st-surface);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius-lg);
  box-shadow: var(--st-shadow-popover);
  overflow: hidden;
}

.st-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--st-space-3) var(--st-space-4);
  font-size: var(--st-text-md);
  font-weight: 500;
  color: var(--st-text);
  border-bottom: 1px solid var(--st-border);
}

.st-modal__close {
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
}
.st-modal__close:hover {
  color: var(--st-text);
}

.st-modal__body {
  padding: var(--st-space-4);
  color: var(--st-text-secondary);
  font-size: var(--st-text-base);
}
</style>
