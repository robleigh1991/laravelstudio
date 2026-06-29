<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
  <span class="st-tooltip">
    <span class="st-tooltip__trigger" tabindex="0">
      <slot />
    </span>
    <span class="st-tooltip__bubble" role="tooltip">{{ label }}</span>
  </span>
</template>

<style scoped>
.st-tooltip {
  position: relative;
  display: inline-flex;
}

.st-tooltip__bubble {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--st-space-1) var(--st-space-2);
  font-size: var(--st-text-sm);
  white-space: nowrap;
  color: var(--st-text);
  background: var(--st-surface-3);
  border: 1px solid var(--st-border-strong);
  border-radius: var(--st-radius-sm);
  box-shadow: var(--st-shadow-popover);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--st-dur-fast) var(--st-ease);
}

.st-tooltip:hover .st-tooltip__bubble,
.st-tooltip__trigger:focus-visible + .st-tooltip__bubble {
  opacity: 1;
}
</style>
