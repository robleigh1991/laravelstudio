<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { renderPreview } from './api';

const props = defineProps<{ blocks: unknown[]; width: number; selectedId: string | null }>();
const emit = defineEmits<{ select: [id: string] }>();

const body = ref('');
const error = ref<string | null>(null);
const frame = ref<HTMLIFrameElement | null>(null);

// Injected into the iframe: report clicks (nearest data-studio-id) up to the
// editor, and outline the block the editor marks selected.
const bridge =
  '(function(){' +
  "document.addEventListener('click',function(e){" +
  "var el=e.target&&e.target.closest?e.target.closest('[data-studio-id]'):null;" +
  "if(el){e.preventDefault();parent.postMessage({source:'studio-preview',type:'select',id:el.getAttribute('data-studio-id')},'*');}" +
  '},true);' +
  "window.addEventListener('message',function(e){" +
  'var d=e.data||{};' +
  "if(d.source==='studio-editor'&&d.type==='select'){" +
  "var prev=document.querySelectorAll('[data-studio-outline]');" +
  "for(var i=0;i<prev.length;i++){prev[i].removeAttribute('data-studio-outline');prev[i].style.outline='';}" +
  "if(d.id){var t=document.querySelector('[data-studio-id=\"'+d.id+'\"]');" +
  "if(t){t.setAttribute('data-studio-outline','');t.style.outline='2px solid #6366f1';t.style.outlineOffset='-2px';}}" +
  '}});' +
  '})();';

const srcdoc = computed(
  () =>
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<scr' +
    'ipt src="https://unpkg.com/@tailwindcss/browser@4"></scr' +
    'ipt></head><body>' +
    body.value +
    '<scr' +
    'ipt>' +
    bridge +
    '</scr' +
    'ipt></body></html>',
);

function onMessage(event: MessageEvent) {
  const data = event.data as { source?: string; type?: string; id?: string } | null;
  if (data && data.source === 'studio-preview' && data.type === 'select' && typeof data.id === 'string') {
    emit('select', data.id);
  }
}

function postSelection() {
  frame.value?.contentWindow?.postMessage(
    { source: 'studio-editor', type: 'select', id: props.selectedId },
    '*',
  );
}

async function refresh() {
  error.value = null;
  try {
    body.value = await renderPreview(props.blocks);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Preview failed.';
  }
}

onMounted(() => window.addEventListener('message', onMessage));
onBeforeUnmount(() => window.removeEventListener('message', onMessage));

watch(() => props.blocks, refresh, { immediate: true });
watch(() => props.selectedId, postSelection);
</script>

<template>
  <div class="preview">
    <div v-if="error" class="preview__error">{{ error }}</div>
    <div class="preview__stage">
      <iframe
        ref="frame"
        class="preview__frame"
        :style="{ width: width + 'px' }"
        :srcdoc="srcdoc"
        title="Live preview"
        sandbox="allow-scripts"
        @load="postSelection"
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
