<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import * as monaco from 'monaco-editor';
import './monacoEnv';

const props = defineProps<{ modelValue: string; language: string; theme: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const host = ref<HTMLElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

onMounted(() => {
  if (host.value === null) {
    return;
  }

  editor = monaco.editor.create(host.value, {
    value: props.modelValue,
    language: props.language,
    theme: props.theme,
    automaticLayout: true,
    fontSize: 13,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    tabSize: 2,
  });

  editor.onDidChangeModelContent(() => {
    const value = editor?.getValue() ?? '';
    if (value !== props.modelValue) {
      emit('update:modelValue', value);
    }
  });
});

onBeforeUnmount(() => {
  editor?.dispose();
  editor = null;
});

watch(
  () => props.modelValue,
  (value) => {
    if (editor && editor.getValue() !== value) {
      editor.setValue(value);
    }
  },
);

watch(
  () => props.language,
  (language) => {
    const model = editor?.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  },
);

watch(
  () => props.theme,
  (theme) => {
    monaco.editor.setTheme(theme);
  },
);
</script>

<template>
  <div ref="host" class="monaco"></div>
</template>

<style scoped>
.monaco {
  width: 100%;
  height: 100%;
}
</style>
