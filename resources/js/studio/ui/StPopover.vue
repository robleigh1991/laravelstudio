<script setup lang="ts">
import { ref } from 'vue';
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue';
import { onClickOutside } from '@vueuse/core';

const open = ref(false);
const reference = ref<HTMLElement | null>(null);
const floating = ref<HTMLElement | null>(null);

const { floatingStyles } = useFloating(reference, floating, {
  placement: 'bottom-start',
  middleware: [offset(6), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
});

onClickOutside(floating, () => (open.value = false), { ignore: [reference] });

function toggle() {
  open.value = !open.value;
}
</script>

<template>
  <div class="st-popover">
    <div ref="reference" class="st-popover__trigger" @click="toggle">
      <slot name="trigger" />
    </div>
    <div
      v-if="open"
      ref="floating"
      class="st-popover__panel"
      :style="floatingStyles"
      role="dialog"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.st-popover {
  display: inline-flex;
}

.st-popover__panel {
  min-width: 180px;
  padding: var(--st-space-2);
  background: var(--st-surface-3);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius);
  box-shadow: var(--st-shadow-popover);
  z-index: 900;
}
</style>
