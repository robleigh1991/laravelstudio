<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    type: 'button',
    disabled: false,
  },
);

defineEmits<{ click: [event: MouseEvent] }>();

const classes = computed(() => ['st-btn', `st-btn--${props.variant}`, `st-btn--${props.size}`]);
</script>

<template>
  <button :class="classes" :type="type" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<style scoped>
.st-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--st-space-2);
  font-family: var(--st-font-sans);
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: var(--st-radius);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color var(--st-dur-fast) var(--st-ease),
    border-color var(--st-dur-fast) var(--st-ease);
}

.st-btn:focus-visible {
  outline: none;
  box-shadow: var(--st-ring);
}

.st-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.st-btn--md {
  height: var(--st-control);
  padding: 0 var(--st-space-4);
  font-size: var(--st-text-base);
}

.st-btn--sm {
  height: var(--st-control-sm);
  padding: 0 var(--st-space-3);
  font-size: var(--st-text-sm);
}

.st-btn--primary {
  background: var(--st-accent);
  color: var(--st-on-accent);
}
.st-btn--primary:hover:not(:disabled) {
  background: var(--st-accent-hover);
}
.st-btn--primary:active:not(:disabled) {
  background: var(--st-accent-active);
}

.st-btn--secondary {
  background: var(--st-surface-2);
  color: var(--st-text);
  border-color: var(--st-border-strong);
}
.st-btn--secondary:hover:not(:disabled) {
  background: var(--st-surface-3);
}

.st-btn--ghost {
  background: transparent;
  color: var(--st-text-secondary);
}
.st-btn--ghost:hover:not(:disabled) {
  background: var(--st-surface-2);
  color: var(--st-text);
}

.st-btn--danger {
  background: var(--st-danger);
  color: var(--st-on-danger);
}
.st-btn--danger:hover:not(:disabled) {
  background: var(--st-danger-hover);
}
</style>
