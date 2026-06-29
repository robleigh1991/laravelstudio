<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<template>
  <section class="st-panel">
    <header v-if="title" class="st-panel__header">{{ title }}</header>
    <div class="st-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.st-panel {
  background: var(--st-surface);
  border: 1px solid var(--st-border);
  border-radius: var(--st-radius);
  overflow: hidden;
}

.st-panel__header {
  padding: var(--st-space-2) var(--st-space-3);
  font-size: var(--st-text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--st-text-muted);
  background: var(--st-surface-2);
  border-bottom: 1px solid var(--st-border);
}

.st-panel__body {
  padding: var(--st-space-3);
}
</style>
