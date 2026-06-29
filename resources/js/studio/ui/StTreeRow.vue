<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label: string;
    depth?: number;
    active?: boolean;
    expandable?: boolean;
    expanded?: boolean;
  }>(),
  {
    depth: 0,
    active: false,
    expandable: false,
    expanded: false,
  },
);

defineEmits<{ click: []; toggle: [] }>();

const indent = computed(() => ({ paddingLeft: `${8 + props.depth * 14}px` }));
</script>

<template>
  <div
    class="st-tree-row"
    :class="{ 'st-tree-row--active': active }"
    role="treeitem"
    :aria-selected="active"
    :aria-expanded="expandable ? expanded : undefined"
    :style="indent"
    @click="$emit('click')"
  >
    <button
      v-if="expandable"
      type="button"
      class="st-tree-row__chevron"
      :aria-label="expanded ? 'Collapse' : 'Expand'"
      @click.stop="$emit('toggle')"
    >
      {{ expanded ? '▾' : '▸' }}
    </button>
    <span v-else class="st-tree-row__spacer" aria-hidden="true"></span>

    <span v-if="$slots.icon" class="st-tree-row__icon"><slot name="icon" /></span>
    <span class="st-tree-row__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.st-tree-row {
  display: flex;
  align-items: center;
  gap: var(--st-space-1);
  height: 26px;
  padding-right: var(--st-space-2);
  font-size: var(--st-text-base);
  color: var(--st-text-secondary);
  border-left: 2px solid transparent;
  cursor: pointer;
  user-select: none;
}

.st-tree-row:hover {
  background: var(--st-surface-2);
  color: var(--st-text);
}

.st-tree-row--active {
  background: var(--st-accent-subtle);
  color: var(--st-text);
  border-left-color: var(--st-accent);
}

.st-tree-row__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 10px;
  color: var(--st-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
}

.st-tree-row__spacer {
  width: 16px;
}

.st-tree-row__icon {
  display: inline-flex;
  color: var(--st-text-muted);
}

.st-tree-row__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
