<script setup lang="ts">
defineProps<{
  modelValue: string;
  tabs: { value: string; label: string }[];
  ariaLabel?: string;
}>();

defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div class="st-tabs" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      role="tab"
      class="st-tabs__tab"
      :class="{ 'st-tabs__tab--active': tab.value === modelValue }"
      :aria-selected="tab.value === modelValue"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.st-tabs {
  display: flex;
  border-bottom: 1px solid var(--st-border);
}

.st-tabs__tab {
  flex: 1;
  padding: var(--st-space-2) var(--st-space-3);
  font-family: var(--st-font-sans);
  font-size: var(--st-text-base);
  color: var(--st-text-muted);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color var(--st-dur-fast) var(--st-ease);
}

.st-tabs__tab:hover {
  color: var(--st-text);
}

.st-tabs__tab:focus-visible {
  outline: none;
  box-shadow: var(--st-ring);
}

.st-tabs__tab--active {
  color: var(--st-text);
  border-bottom-color: var(--st-accent);
}
</style>
