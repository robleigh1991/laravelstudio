<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useFilesStore } from './stores/files';
import { useEditorStore } from './stores/editor';
import { detectLanguage } from './editor/language';
import StButton from '../ui/StButton.vue';

// Lazy so Monaco (and its workers) only load when a file is actually opened —
// keeps it out of the test/jsdom path and off the initial bundle.
const MonacoEditor = defineAsyncComponent(() => import('./editor/MonacoEditor.vue'));

const files = useFilesStore();
const editor = useEditorStore();

const language = computed(() =>
  files.openPath === null ? 'plaintext' : detectLanguage(files.openPath),
);
const monacoTheme = computed(() => (editor.theme === 'dark' ? 'vs-dark' : 'vs'));
const hasFile = computed(() => files.openPath !== null && files.openContents !== null);
</script>

<template>
  <div class="editor-pane">
    <div v-if="files.openPath !== null" class="editor-pane__bar">
      <span class="editor-pane__path">
        {{ files.openPath }}<span v-if="files.dirty" class="editor-pane__dot" aria-label="Unsaved">●</span>
      </span>
      <StButton size="sm" variant="primary" @click="files.saveOpenFile()">Save</StButton>
    </div>
    <div class="editor-pane__body">
      <MonacoEditor
        v-if="hasFile"
        :model-value="files.openContents ?? ''"
        :language="language"
        :theme="monacoTheme"
        @update:model-value="files.setOpenContents($event)"
      />
      <p v-else class="editor-pane__empty">Select a file in the Explorer to edit it.</p>
    </div>
  </div>
</template>

<style scoped>
.editor-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.editor-pane__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--st-space-3);
  padding: var(--st-space-2) var(--st-space-3);
  border-bottom: 1px solid var(--st-border);
  background: var(--st-surface);
}

.editor-pane__path {
  font-family: var(--st-font-mono);
  font-size: var(--st-text-sm);
  color: var(--st-text-secondary);
}

.editor-pane__dot {
  margin-left: var(--st-space-2);
  color: var(--st-warning);
}

.editor-pane__body {
  flex: 1;
  min-height: 0;
}

.editor-pane__empty {
  padding: var(--st-space-5);
  text-align: center;
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
}
</style>
