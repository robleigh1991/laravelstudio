<script setup lang="ts">
defineProps<{
  modelValue: string;
  options: { value: string; label: string }[];
  ariaLabel?: string;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="st-segmented" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="tab"
      class="st-segmented__item"
      :class="{ 'st-segmented__item--active': option.value === modelValue }"
      :aria-selected="option.value === modelValue"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.st-segmented {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--st-surface-2);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius);
}

.st-segmented__item {
  display: inline-flex;
  align-items: center;
  gap: var(--st-space-1);
  padding: 4px 10px;
  font-family: var(--st-font-sans);
  font-size: var(--st-text-sm);
  color: var(--st-text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--st-radius-sm);
  cursor: pointer;
  transition:
    background-color var(--st-dur-fast) var(--st-ease),
    color var(--st-dur-fast) var(--st-ease);
}

.st-segmented__item:hover {
  color: var(--st-text);
}

.st-segmented__item:focus-visible {
  outline: none;
  box-shadow: var(--st-ring);
}

.st-segmented__item--active {
  color: var(--st-on-accent);
  background: var(--st-accent);
}
.st-segmented__item--active:hover {
  color: var(--st-on-accent);
}
</style>
