<script setup lang="ts">
import { ref } from 'vue';
import StButton from '../ui/StButton.vue';
import StTextInput from '../ui/StTextInput.vue';
import StSegmented from '../ui/StSegmented.vue';
import StPanel from '../ui/StPanel.vue';

defineOptions({ name: 'StudioGallery' });

const theme = ref<'dark' | 'light'>('dark');
const headline = ref('Build real Laravel sites, visually.');
const breakpoint = ref('base');

const breakpoints = [
  { value: 'base', label: 'Mobile' },
  { value: 'md', label: 'Tablet' },
  { value: 'lg', label: 'Desktop' },
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
