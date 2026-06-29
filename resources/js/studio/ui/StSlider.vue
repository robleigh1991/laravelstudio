<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    ariaLabel?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    ariaLabel: undefined,
  },
);

defineEmits<{ 'update:modelValue': [value: number] }>();
</script>

<template>
  <input
    class="st-slider"
    type="range"
    :min="min"
    :max="max"
    :step="step"
    :value="modelValue"
    :aria-label="ariaLabel"
    @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
  />
</template>

<style scoped>
.st-slider {
  width: 100%;
  height: 18px;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.st-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
  background: var(--st-border-strong);
}

.st-slider::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: var(--st-border-strong);
}

.st-slider::-webkit-slider-thumb {
  appearance: none;
  margin-top: -5px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--st-accent);
  border: none;
}

.st-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--st-accent);
  border: none;
}

.st-slider:focus-visible {
  outline: none;
}

.st-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--st-ring);
}
</style>
