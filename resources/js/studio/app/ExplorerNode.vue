<script setup lang="ts">
import StTreeRow from '../ui/StTreeRow.vue';
import { useFilesStore } from './stores/files';
import type { FileEntry } from './api';

const props = defineProps<{ entry: FileEntry; depth: number }>();

defineOptions({ name: 'ExplorerNode' });

const files = useFilesStore();

function onClick() {
  if (props.entry.type === 'dir') {
    files.toggleDir(props.entry.path);
  } else {
    files.openFile(props.entry.path);
  }
}

function onToggle() {
  files.toggleDir(props.entry.path);
}
</script>

<template>
  <StTreeRow
    :label="entry.name"
    :depth="depth"
    :expandable="entry.type === 'dir'"
    :expanded="files.isExpanded(entry.path)"
    :active="files.openPath === entry.path"
    @click="onClick"
    @toggle="onToggle"
  />
  <template v-if="entry.type === 'dir' && files.isExpanded(entry.path)">
    <ExplorerNode
      v-for="child in files.children[entry.path] ?? []"
      :key="child.path"
      :entry="child"
      :depth="depth + 1"
    />
  </template>
</template>
