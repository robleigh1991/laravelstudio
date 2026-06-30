<script setup lang="ts">
import { usePageStore } from './stores/page';
import { availableComponents } from './editor/registry';
import StPopover from '../ui/StPopover.vue';
import StButton from '../ui/StButton.vue';

const page = usePageStore();

function add(type: string) {
  page.addBlock(type);
}
</script>

<template>
  <StPopover>
    <template #trigger>
      <StButton size="sm" variant="secondary">+ Add block</StButton>
    </template>
    <div class="palette" role="menu" aria-label="Add a block">
      <button
        v-for="component in availableComponents"
        :key="component.type"
        type="button"
        role="menuitem"
        class="palette__item"
        @click="add(component.type)"
      >
        {{ component.label }}
      </button>
    </div>
  </StPopover>
</template>

<style scoped>
.palette {
  display: flex;
  flex-direction: column;
  min-width: 160px;
}

.palette__item {
  text-align: left;
  padding: var(--st-space-2) var(--st-space-3);
  font-family: var(--st-font-sans);
  font-size: var(--st-text-base);
  color: var(--st-text);
  background: transparent;
  border: none;
  border-radius: var(--st-radius-sm);
  cursor: pointer;
}

.palette__item:hover {
  background: var(--st-accent-subtle);
}
</style>
