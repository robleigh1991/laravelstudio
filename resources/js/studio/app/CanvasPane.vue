<script setup lang="ts">
import { computed, ref } from 'vue';
import { useFilesStore } from './stores/files';
import { useEditorStore } from './stores/editor';
import { parsePageBlocks } from './editor/page';
import PreviewCanvas from './PreviewCanvas.vue';
import EditorPane from './EditorPane.vue';
import StSegmented from '../ui/StSegmented.vue';

const files = useFilesStore();
const editor = useEditorStore();
const view = ref<'preview' | 'code'>('preview');

const views = [
  { value: 'preview', label: 'Preview' },
  { value: 'code', label: 'Code' },
];

const pageBlocks = computed(() => parsePageBlocks(files.openContents));

const breakpointWidth = computed(() => {
  switch (editor.breakpoint) {
    case 'md':
      return 768;
    case 'lg':
      return 1024;
    default:
      return 390;
  }
});

function onView(value: string) {
  view.value = value === 'code' ? 'code' : 'preview';
}
</script>

<template>
  <div class="canvas">
    <div class="canvas__bar">
      <StSegmented :model-value="view" :options="views" aria-label="View" @update:model-value="onView" />
      <span class="canvas__width">{{ breakpointWidth }} px</span>
    </div>
    <div class="canvas__body">
      <PreviewCanvas
        v-if="view === 'preview' && pageBlocks !== null"
        :blocks="pageBlocks ?? []"
        :width="breakpointWidth"
      />
      <p v-else-if="view === 'preview'" class="canvas__hint">
        Open a page (a .json file under studio/pages) to preview it.
      </p>
      <EditorPane v-else />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.canvas__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--st-space-3);
  height: 38px;
  padding: 0 var(--st-space-3);
  border-bottom: 1px solid var(--st-border);
  background: var(--st-surface-2);
}

.canvas__width {
  font-size: var(--st-text-xs);
  color: var(--st-text-muted);
}

.canvas__body {
  flex: 1;
  min-height: 0;
}

.canvas__hint {
  padding: var(--st-space-5);
  text-align: center;
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
}
</style>
