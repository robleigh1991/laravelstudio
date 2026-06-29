<script setup lang="ts">
import { ref } from 'vue';
import StButton from '../ui/StButton.vue';
import StTextInput from '../ui/StTextInput.vue';
import StSegmented from '../ui/StSegmented.vue';
import StPanel from '../ui/StPanel.vue';
import StSelect from '../ui/StSelect.vue';
import StSlider from '../ui/StSlider.vue';
import StTabs from '../ui/StTabs.vue';
import StTooltip from '../ui/StTooltip.vue';
import StTreeRow from '../ui/StTreeRow.vue';
import StModal from '../ui/StModal.vue';
import StColorPicker from '../ui/StColorPicker.vue';

defineOptions({ name: 'StudioGallery' });

const theme = ref<'dark' | 'light'>('dark');
const headline = ref('Build real Laravel sites, visually.');
const breakpoint = ref('base');
const weight = ref('bold');
const fontSize = ref(30);
const panelTab = ref('inspect');
const bgColor = ref('#ffffff');
const modalOpen = ref(false);
const pagesExpanded = ref(true);

const breakpoints = [
  { value: 'base', label: 'Mobile' },
  { value: 'md', label: 'Tablet' },
  { value: 'lg', label: 'Desktop' },
];

const weights = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'bold', label: 'Bold' },
];

const panelTabs = [
  { value: 'inspect', label: 'Inspect' },
  { value: 'ai', label: 'AI' },
];

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <div :data-theme="theme" class="gallery">
    <header class="gallery__bar">
      <span class="gallery__brand"><span class="gallery__logo">L</span> Studio — component kit</span>
      <StButton size="sm" @click="toggleTheme">
        {{ theme === 'dark' ? 'Light theme' : 'Dark theme' }}
      </StButton>
    </header>

    <div class="gallery__grid">
      <StPanel title="Buttons">
        <div class="row">
          <StButton variant="primary">Publish</StButton>
          <StButton variant="secondary">Cancel</StButton>
          <StButton variant="ghost">Ghost</StButton>
          <StButton variant="danger">Delete</StButton>
        </div>
        <div class="row">
          <StButton variant="primary" size="sm">Small</StButton>
          <StButton variant="secondary" size="sm">Small</StButton>
          <StButton variant="secondary" disabled>Disabled</StButton>
        </div>
      </StPanel>

      <StPanel title="Text input">
        <label class="label">Headline</label>
        <StTextInput v-model="headline" aria-label="Headline" placeholder="Headline" />
        <p class="hint">Value: {{ headline }}</p>
      </StPanel>

      <StPanel title="Segmented — breakpoint switcher">
        <StSegmented v-model="breakpoint" :options="breakpoints" aria-label="Breakpoint" />
        <p class="hint">
          Active: {{ breakpoint }} —
          <template v-if="breakpoint === 'base'">writes base utilities</template>
          <template v-else>writes {{ breakpoint }}: overrides</template>
        </p>
      </StPanel>

      <StPanel title="Select">
        <label class="label">Font weight</label>
        <StSelect v-model="weight" :options="weights" aria-label="Font weight" />
        <p class="hint">Value: {{ weight }}</p>
      </StPanel>

      <StPanel title="Slider">
        <label class="label">Font size — {{ fontSize }}px</label>
        <StSlider v-model="fontSize" :min="12" :max="72" aria-label="Font size" />
      </StPanel>

      <StPanel title="Tabs">
        <StTabs v-model="panelTab" :tabs="panelTabs" aria-label="Inspector panel" />
        <p class="hint">Active panel: {{ panelTab }}</p>
      </StPanel>

      <StPanel title="Tooltip">
        <StTooltip label="Resets this property to inherit">
          <StButton size="sm" variant="ghost">Hover or focus me</StButton>
        </StTooltip>
      </StPanel>

      <StPanel title="Color picker">
        <label class="label">Background</label>
        <StColorPicker v-model="bgColor" aria-label="Background" />
      </StPanel>

      <StPanel title="Tree rows — explorer / layers">
        <StTreeRow
          label="Pages"
          :expandable="true"
          :expanded="pagesExpanded"
          @toggle="pagesExpanded = !pagesExpanded"
        />
        <template v-if="pagesExpanded">
          <StTreeRow label="home" :depth="1" :active="true" />
          <StTreeRow label="about" :depth="1" />
          <StTreeRow label="pricing" :depth="1" />
        </template>
        <StTreeRow label="Components" :expandable="true" :expanded="false" />
      </StPanel>

      <StPanel title="Modal">
        <StButton variant="secondary" @click="modalOpen = true">Open modal</StButton>
        <StModal :open="modalOpen" title="Publish page" @close="modalOpen = false">
          This compiles the page to Blade and commits it. Continue?
        </StModal>
      </StPanel>

      <StPanel title="Panel">
        <p class="hint">Panels group inspector sections and explorer regions. This is a panel.</p>
      </StPanel>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  min-height: 100vh;
  padding: var(--st-space-5);
  background: var(--st-bg);
  color: var(--st-text);
  font-family: var(--st-font-sans);
}

.gallery__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--st-space-5);
}

.gallery__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--st-space-2);
  font-size: var(--st-text-md);
  font-weight: 500;
}

.gallery__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--st-radius-sm);
  background: var(--st-accent);
  color: var(--st-on-accent);
  font-size: var(--st-text-sm);
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--st-space-4);
  max-width: 960px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--st-space-2);
  margin-bottom: var(--st-space-2);
}

.label {
  display: block;
  margin-bottom: var(--st-space-2);
  font-size: var(--st-text-sm);
  color: var(--st-text-secondary);
}

.hint {
  margin: var(--st-space-2) 0 0;
  font-size: var(--st-text-sm);
  color: var(--st-text-muted);
}
</style>
