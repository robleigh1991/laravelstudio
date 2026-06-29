<script setup lang="ts">
defineProps<{ modelValue: string; ariaLabel?: string }>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="st-color">
    <input
      class="st-color__swatch"
      type="color"
      :value="modelValue"
      :aria-label="ariaLabel ?? 'Color'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <input
      class="st-color__hex"
      type="text"
      :value="modelValue"
      :aria-label="(ariaLabel ?? 'Color') + ' hex value'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.st-color {
  display: flex;
  align-items: center;
  gap: var(--st-space-2);
}

.st-color__swatch {
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius-sm);
  cursor: pointer;
}

.st-color__hex {
  box-sizing: border-box;
  flex: 1;
  height: var(--st-control);
  padding: 0 var(--st-space-3);
  font-family: var(--st-font-mono);
  font-size: var(--st-text-base);
  color: var(--st-text);
  background: var(--st-surface-2);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius);
}

.st-color__hex:focus {
  outline: none;
  border-color: var(--st-accent);
  box-shadow: var(--st-ring);
}
</style>
