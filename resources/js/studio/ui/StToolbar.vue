<script setup lang="ts">
defineProps<{ ariaLabel?: string }>();
</script>

<template>
  <div class="st-toolbar" role="toolbar" :aria-label="ariaLabel">
    <div class="st-toolbar__group"><slot name="start" /></div>
    <div class="st-toolbar__group st-toolbar__group--center"><slot name="center" /></div>
    <div class="st-toolbar__group"><slot name="end" /></div>
  </div>
</template>

<style scoped>
.st-toolbar {
  display: flex;
  align-items: center;
  gap: var(--st-space-3);
  height: 44px;
  padding: 0 var(--st-space-3);
  background: var(--st-surface-2);
  border-bottom: 1px solid var(--st-border);
}

.st-toolbar__group {
  display: flex;
  align-items: center;
  gap: var(--st-space-2);
}

.st-toolbar__group--center {
  flex: 1;
  justify-content: center;
}
</style>
