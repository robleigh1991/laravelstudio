<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    type: 'text',
    disabled: false,
    ariaLabel: undefined,
  },
);

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input
    class="st-input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<style scoped>
.st-input {
  width: 100%;
  height: var(--st-control);
  padding: 0 var(--st-space-3);
  font-family: var(--st-font-sans);
  font-size: var(--st-text-base);
  color: var(--st-text);
  background: var(--st-surface-2);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius);
  transition:
    border-color var(--st-dur-fast) var(--st-ease),
    box-shadow var(--st-dur-fast) var(--st-ease);
}

.st-input::placeholder {
  color: var(--st-text-muted);
}

.st-input:hover:not(:disabled) {
  border-color: var(--st-text-muted);
}

.st-input:focus {
  outline: none;
  border-color: var(--st-accent);
  box-shadow: var(--st-ring);
}

.st-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
