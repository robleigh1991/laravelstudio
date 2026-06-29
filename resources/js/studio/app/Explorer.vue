<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useFilesStore } from './stores/files';
import ExplorerNode from './ExplorerNode.vue';
import StModal from '../ui/StModal.vue';
import StTextInput from '../ui/StTextInput.vue';
import StButton from '../ui/StButton.vue';

defineOptions({ name: 'FileExplorer' });

const files = useFilesStore();
const renameName = ref('');

watch(
  () => files.renameTarget,
  (target) => {
    renameName.value = target?.name ?? '';
  },
);

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

    <StModal :open="files.renameTarget !== null" title="Rename" @close="files.cancelAction()">
      <StTextInput v-model="renameName" aria-label="New name" placeholder="New name" />
      <div class="explorer__actions">
        <StButton size="sm" @click="files.cancelAction()">Cancel</StButton>
        <StButton size="sm" variant="primary" @click="files.confirmRename(renameName)">Rename</StButton>
      </div>
    </StModal>

    <StModal :open="files.deleteTarget !== null" title="Delete" @close="files.cancelAction()">
      <p class="explorer__confirm">
        Delete "{{ files.deleteTarget?.name }}"? This can't be undone.
      </p>
      <div class="explorer__actions">
        <StButton size="sm" @click="files.cancelAction()">Cancel</StButton>
        <StButton size="sm" variant="danger" @click="files.confirmDelete()">Delete</StButton>
      </div>
    </StModal>
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

.explorer__confirm {
  margin: 0 0 var(--st-space-3);
  font-size: var(--st-text-base);
  color: var(--st-text-secondary);
}

.explorer__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--st-space-2);
  margin-top: var(--st-space-3);
}
</style>
