<script setup lang="ts">
import { computed } from 'vue';
import { usePageStore } from './stores/page';
import { fieldsFor } from './editor/registry';
import StTextInput from '../ui/StTextInput.vue';

const page = usePageStore();

const selected = computed(() =>
  page.selectedId === null ? undefined : page.findBlock(page.selectedId),
);
const fields = computed(() => (selected.value ? fieldsFor(selected.value.type) : []));

function valueOf(key: string): string {
  const value = selected.value?.props?.[key];
  if (typeof value === 'string') {
    return value;
  }
  return value === undefined || value === null ? '' : String(value);
}

function onInput(key: string, value: string) {
  if (selected.value) {
    page.updateProps(selected.value.id, { [key]: value });
  }
}
</script>

<template>
  <div class="inspector">
    <template v-if="selected">
      <div class="inspector__head">
        <span class="inspector__type">{{ selected?.type }}</span>
        <span class="inspector__id">{{ selected?.id }}</span>
      </div>
      <div class="inspector__section">
        <label v-for="field in fields" :key="field.key" class="inspector__field">
          <span class="inspector__label">{{ field.label }}</span>
          <StTextInput
            :model-value="valueOf(field.key)"
            :aria-label="field.label"
            @update:model-value="onInput(field.key, $event)"
          />
        </label>
        <p v-if="fields.length === 0" class="inspector__hint">
          No editable text fields for this block yet.
        </p>
      </div>
    </template>
    <p v-else class="inspector__empty">Select an element on the canvas to edit it.</p>
  </div>
</template>

<style scoped>
.inspector__head {
  display: flex;
  align-items: center;
  gap: var(--st-space-2);
  padding: var(--st-space-3);
  border-bottom: 1px solid var(--st-border);
}

.inspector__type {
  font-size: var(--st-text-base);
  font-weight: 500;
  color: var(--st-text);
}

.inspector__id {
  font-family: var(--st-font-mono);
  font-size: var(--st-text-xs);
  color: var(--st-text-muted);
}

.inspector__section {
  padding: var(--st-space-3);
  display: flex;
  flex-direction: column;
  gap: var(--st-space-3);
}

.inspector__field {
  display: flex;
  flex-direction: column;
  gap: var(--st-space-1);
}

.inspector__label {
  font-size: var(--st-text-xs);
  color: var(--st-text-secondary);
}

.inspector__hint,
.inspector__empty {
  padding: var(--st-space-3);
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
}
</style>
