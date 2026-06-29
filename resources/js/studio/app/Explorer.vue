<script setup lang="ts">
import { onMounted } from 'vue';
import { useFilesStore } from './stores/files';
import ExplorerNode from './ExplorerNode.vue';

defineOptions({ name: 'FileExplorer' });

const files = useFilesStore();

onMounted(() => {
  files.loadRoot();
});
</script>

<template>
  <div class="explorer">
    <div class="explorer__section">Explorer</div>
    <div v-if="files.error" class="explorer__error">{{ files.error }}</div>
    <div role="tree" aria-label="Project files">
      <ExplorerNode v-for="entry in files.root" :key="entry.path" :entry="entry" :depth="0" />
    </div>
  </div>
</template>

<style scoped>
.explorer__section {
  padding: var(--st-space-2) var(--st-space-3);
  font-size: var(--st-text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--st-text-muted);
}

.explorer__error {
  padding: var(--st-space-2) var(--st-space-3);
  font-size: var(--st-text-sm);
  color: var(--st-danger);
}
</style>
