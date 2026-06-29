<script setup lang="ts">
import { ref } from 'vue';
import { useFloating, offset, flip, shift } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';

defineProps<{ items: { label: string; value: string }[] }>();
const emit = defineEmits<{ select: [value: string] }>();

const open = ref(false);
const point = ref({ x: 0, y: 0 });
const floating = ref<HTMLElement | null>(null);

const virtualReference = ref({
  getBoundingClientRect() {
    const { x, y } = point.value;
    return { x, y, top: y, left: x, right: x, bottom: y, width: 0, height: 0 };
  },
});

const { floatingStyles } = useFloating(virtualReference, floating, {
  placement: 'bottom-start',
  middleware: [offset(2), flip(), shift({ padding: 8 })],
});

onClickOutside(floating, () => (open.value = false));

function onContextMenu(event: MouseEvent) {
  event.preventDefault();
  point.value = { x: event.clientX, y: event.clientY };
  open.value = true;
}

function choose(value: string) {
  emit('select', value);
  open.value = false;
}
</script>

<template>
  <div class="st-ctx" @contextmenu="onContextMenu">
    <slot />
    <div v-if="open" ref="floating" class="st-ctx__menu" :style="floatingStyles" role="menu">
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        role="menuitem"
        class="st-ctx__item"
        @click="choose(item.value)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.st-ctx {
  display: block;
}

.st-ctx__menu {
  min-width: 160px;
  padding: var(--st-space-1);
  background: var(--st-surface-3);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius);
  box-shadow: var(--st-shadow-popover);
  z-index: 900;
}

.st-ctx__item {
  display: block;
  width: 100%;
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

.st-ctx__item:hover {
  background: var(--st-accent-subtle);
}
</style>
