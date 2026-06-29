<script setup lang="ts">
defineProps<{
  modelValue: string;
  options: { value: string; label: string }[];
  ariaLabel?: string;
  disabled?: boolean;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="st-select">
    <select
      class="st-select__field"
      :value="modelValue"
      :disabled="disabled"
      :aria-label="ariaLabel"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span class="st-select__chevron" aria-hidden="true">▾</span>
  </div>
</template>

<style scoped>
.st-select {
  position: relative;
  display: block;
}

.st-select__field {
  width: 100%;
  height: var(--st-control);
  padding: 0 var(--st-space-5) 0 var(--st-space-3);
  font-family: var(--st-font-sans);
  font-size: var(--st-text-base);
  color: var(--st-text);
  background: var(--st-surface-2);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius);
  appearance: none;
  cursor: pointer;
}

.st-select__field:hover:not(:disabled) {
  border-color: var(--st-text-muted);
}

.st-select__field:focus {
  outline: none;
  border-color: var(--st-accent);
  box-shadow: var(--st-ring);
}

.st-select__field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.st-select__chevron {
  position: absolute;
  top: 50%;
  right: var(--st-space-3);
  transform: translateY(-50%);
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
  pointer-events: none;
}
</style>
