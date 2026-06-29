<script setup lang="ts">
import StTreeRow from '../ui/StTreeRow.vue';
import StContextMenu from '../ui/StContextMenu.vue';
import { useFilesStore } from './stores/files';
import type { FileEntry } from './api';

const props = defineProps<{ entry: FileEntry; depth: number }>();

defineOptions({ name: 'ExplorerNode' });

const files = useFilesStore();

const actions = [
  { label: 'Rename', value: 'rename' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Delete', value: 'delete' },
];

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

function onAction(action: string) {
  if (action === 'rename') {
    files.requestRename(props.entry);
  } else if (action === 'duplicate') {
    files.duplicate(props.entry);
  } else if (action === 'delete') {
    files.requestDelete(props.entry);
  }
}
</script>

<template>
  <StContextMenu :items="actions" @select="onAction">
    <StTreeRow
      :label="entry.name"
      :depth="depth"
      :expandable="entry.type === 'dir'"
      :expanded="files.isExpanded(entry.path)"
      :active="files.openPath === entry.path"
      @click="onClick"
      @toggle="onToggle"
    />
  </StContextMenu>
  <template v-if="entry.type === 'dir' && files.isExpanded(entry.path)">
    <ExplorerNode
      v-for="child in files.children[entry.path] ?? []"
      :key="child.path"
      :entry="child"
      :depth="depth + 1"
    />
  </template>
</template>
