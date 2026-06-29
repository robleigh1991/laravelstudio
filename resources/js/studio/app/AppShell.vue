<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEditorStore, type Breakpoint } from './stores/editor';
import StToolbar from '../ui/StToolbar.vue';
import StSegmented from '../ui/StSegmented.vue';
import StButton from '../ui/StButton.vue';
import StTabs from '../ui/StTabs.vue';
import StTreeRow from '../ui/StTreeRow.vue';

const editor = useEditorStore();
const panelTab = ref<'inspect' | 'ai'>('inspect');

const breakpoints = [
  { value: 'base', label: 'Mobile' },
  { value: 'md', label: 'Tablet' },
  { value: 'lg', label: 'Desktop' },
];

const panelTabs = [
  { value: 'inspect', label: 'Inspect' },
  { value: 'ai', label: 'AI' },
];

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

function onBreakpoint(value: string) {
  editor.setBreakpoint(value as Breakpoint);
}

function onPanel(value: string) {
  panelTab.value = value === 'ai' ? 'ai' : 'inspect';
}

function startResize(side: 'left' | 'right', event: PointerEvent) {
  event.preventDefault();
  const startX = event.clientX;
  const startWidth = side === 'left' ? editor.leftWidth : editor.rightWidth;

  function onMove(move: PointerEvent) {
    const delta = move.clientX - startX;
    if (side === 'left') {
      editor.setLeftWidth(startWidth + delta);
    } else {
      editor.setRightWidth(startWidth - delta);
    }
  }

  function onUp() {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  }

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}
</script>

<template>
  <div class="shell" :data-theme="editor.theme">
    <div class="shell__titlebar">
      <span class="shell__brand"><span class="shell__logo">L</span> Studio</span>
      <span class="shell__title">home.json</span>
      <span class="shell__branch">main</span>
    </div>

    <StToolbar aria-label="Editor">
      <template #start>
        <StButton size="sm" variant="ghost" @click="editor.toggleLeft()">Explorer</StButton>
      </template>
      <template #center>
        <StSegmented
          :model-value="editor.breakpoint"
          :options="breakpoints"
          aria-label="Breakpoint"
          @update:model-value="onBreakpoint"
        />
      </template>
      <template #end>
        <StButton size="sm" @click="editor.toggleTheme()">
          {{ editor.theme === 'dark' ? 'Light' : 'Dark' }}
        </StButton>
        <StButton size="sm" variant="primary">Publish</StButton>
      </template>
    </StToolbar>

    <div class="shell__body">
      <aside
        v-show="!editor.leftCollapsed"
        class="shell__rail"
        data-pane="explorer"
        :style="{ width: editor.leftWidth + 'px' }"
      >
        <div class="shell__section">Explorer</div>
        <div role="tree" aria-label="Pages">
          <StTreeRow label="Pages" :expandable="true" :expanded="true" />
          <StTreeRow label="home" :depth="1" :active="true" />
          <StTreeRow label="about" :depth="1" />
          <StTreeRow label="Components" :expandable="true" :expanded="false" />
        </div>
      </aside>

      <div
        class="shell__divider"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize explorer"
        @pointerdown="startResize('left', $event)"
      ></div>

      <main class="shell__canvas" data-pane="preview">
        <div class="shell__canvas-bar">Live preview · {{ breakpointWidth }} px</div>
        <div class="shell__canvas-area">
          <div class="shell__device" :style="{ width: breakpointWidth + 'px' }">
            <p class="shell__empty">Select a page to preview</p>
          </div>
        </div>
      </main>

      <div
        class="shell__divider"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize inspector"
        @pointerdown="startResize('right', $event)"
      ></div>

      <aside
        v-show="!editor.rightCollapsed"
        class="shell__rail"
        data-pane="inspector"
        :style="{ width: editor.rightWidth + 'px' }"
      >
        <StTabs
          :model-value="panelTab"
          :tabs="panelTabs"
          aria-label="Inspector panel"
          @update:model-value="onPanel"
        />
        <div class="shell__inspector">
          <p v-if="panelTab === 'inspect'" class="shell__empty">
            Select an element to edit its properties.
          </p>
          <p v-else class="shell__empty">Ask AI to build or change a page.</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--st-bg);
  color: var(--st-text);
  font-family: var(--st-font-sans);
  overflow: hidden;
}

.shell__titlebar {
  display: flex;
  align-items: center;
  gap: var(--st-space-3);
  height: 34px;
  padding: 0 var(--st-space-3);
  background: var(--st-surface-2);
  border-bottom: 1px solid var(--st-border);
  font-size: var(--st-text-sm);
}

.shell__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--st-space-2);
  font-weight: 500;
}

.shell__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: var(--st-radius-sm);
  background: var(--st-accent);
  color: var(--st-on-accent);
  font-size: var(--st-text-xs);
}

.shell__title {
  flex: 1;
  text-align: center;
  color: var(--st-text-secondary);
}

.shell__branch {
  color: var(--st-text-muted);
}

.shell__body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.shell__rail {
  background: var(--st-surface);
  overflow: auto;
  flex-shrink: 0;
}

.shell__section {
  padding: var(--st-space-2) var(--st-space-3);
  font-size: var(--st-text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--st-text-muted);
}

.shell__divider {
  width: 4px;
  cursor: col-resize;
  background: var(--st-border);
  flex-shrink: 0;
}
.shell__divider:hover {
  background: var(--st-accent);
}

.shell__canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--st-bg);
}

.shell__canvas-bar {
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 var(--st-space-3);
  font-size: var(--st-text-xs);
  color: var(--st-text-muted);
  border-bottom: 1px solid var(--st-border);
}

.shell__canvas-area {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--st-space-5);
  overflow: auto;
}

.shell__device {
  min-height: 200px;
  background: #ffffff;
  border-radius: var(--st-radius);
  box-shadow: var(--st-shadow-popover);
  flex-shrink: 0;
}

.shell__empty {
  padding: var(--st-space-5);
  text-align: center;
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
}

.shell__inspector {
  padding: var(--st-space-2);
}
</style>
