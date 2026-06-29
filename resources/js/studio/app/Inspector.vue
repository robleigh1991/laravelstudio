<script setup lang="ts">
import { computed } from 'vue';
import { usePageStore } from './stores/page';
import { useEditorStore } from './stores/editor';
import { fieldsFor } from './editor/registry';
import { EDIT_BREAKPOINTS, type Breakpoint } from '../types/block';
import StTextInput from '../ui/StTextInput.vue';
import StButton from '../ui/StButton.vue';

defineOptions({ name: 'BlockInspector' });

const page = usePageStore();
const editor = useEditorStore();

const breakpointLabels: Record<string, string> = { base: 'Mobile', md: 'Tablet', lg: 'Desktop' };
const editBreakpoints = EDIT_BREAKPOINTS;

const selected = computed(() =>
  page.selectedId === null ? undefined : page.findBlock(page.selectedId),
);
const fields = computed(() => (selected.value ? fieldsFor(selected.value.type) : []));

const classesValue = computed(() =>
  (selected.value?.classes?.[editor.breakpoint] ?? []).join(' '),
);

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

function onClasses(value: string) {
  if (selected.value) {
    page.updateClasses(
      selected.value.id,
      editor.breakpoint,
      value.split(/\s+/).filter((cls) => cls !== ''),
    );
  }
}

function hasClasses(breakpoint: Breakpoint): boolean {
  return (selected.value?.classes?.[breakpoint] ?? []).length > 0;
}

const canReset = computed(() => editor.breakpoint !== 'base' && hasClasses(editor.breakpoint));

function resetClasses() {
  if (selected.value) {
    page.updateClasses(selected.value.id, editor.breakpoint, []);
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

      <div class="inspector__section inspector__section--bordered">
        <div class="inspector__row">
          <span class="inspector__label">Classes — {{ breakpointLabels[editor.breakpoint] }}</span>
          <StButton v-if="canReset" size="sm" variant="ghost" @click="resetClasses">Reset</StButton>
        </div>
        <StTextInput
          :model-value="classesValue"
          aria-label="Classes"
          placeholder="e.g. py-20 bg-gray-100"
          @update:model-value="onClasses"
        />
        <div class="inspector__bps">
          <span
            v-for="bp in editBreakpoints"
            :key="bp.key"
            :data-bp="bp.key"
            class="inspector__bp"
            :class="{
              'inspector__bp--set': hasClasses(bp.key),
              'inspector__bp--active': bp.key === editor.breakpoint,
            }"
          >
            {{ bp.label }}
          </span>
        </div>
        <p class="inspector__hint">
          Editing applies to the {{ breakpointLabels[editor.breakpoint] }} breakpoint. A dot means
          that breakpoint has overrides.
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

.inspector__section--bordered {
  border-top: 1px solid var(--st-border);
}

.inspector__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--st-space-2);
}

.inspector__bps {
  display: flex;
  gap: var(--st-space-2);
}

.inspector__bp {
  display: inline-flex;
  align-items: center;
  gap: var(--st-space-1);
  font-size: var(--st-text-xs);
  color: var(--st-text-muted);
}

.inspector__bp::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--st-border-strong);
}

.inspector__bp--set::before {
  background: var(--st-accent);
}

.inspector__bp--active {
  color: var(--st-text);
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
