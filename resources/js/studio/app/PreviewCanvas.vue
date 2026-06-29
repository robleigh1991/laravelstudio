<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { renderPreview } from './api';

const props = defineProps<{ blocks: unknown[]; width: number }>();

const body = ref('');
const error = ref<string | null>(null);
const loading = ref(false);

// The generated sites use Tailwind; load the browser build so the preview
// matches published output without a build step. (Dev-preview convenience.)
const srcdoc = computed(
  () =>
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<script src="https://unpkg.com/@tailwindcss/browser@4"><\/script>' +
    `</head><body>${body.value}</body></html>`,
);

async function refresh() {
  loading.value = true;
  error.value = null;
  try {
    body.value = await renderPreview(props.blocks);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Preview failed.';
  } finally {
    loading.value = false;
  }
}

watch(() => props.blocks, refresh, { immediate: true });
</script>

<template>
  <div class="preview">
    <div v-if="error" class="preview__error">{{ error }}</div>
    <div class="preview__stage">
      <iframe
        class="preview__frame"
        :style="{ width: width + 'px' }"
        :srcdoc="srcdoc"
        title="Live preview"
        sandbox="allow-scripts"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.preview__error {
  padding: var(--st-space-2) var(--st-space-3);
  font-size: var(--st-text-sm);
  color: var(--st-danger);
}

.preview__stage {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--st-space-5);
  overflow: auto;
}

.preview__frame {
  height: 100%;
  min-height: 480px;
  background: #ffffff;
  border: none;
  border-radius: var(--st-radius);
  box-shadow: var(--st-shadow-popover);
  flex-shrink: 0;
}
</style>
