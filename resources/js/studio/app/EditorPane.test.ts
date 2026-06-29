import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import EditorPane from './EditorPane.vue';
import { useFilesStore } from './stores/files';

function mountPane() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(EditorPane, { global: { plugins: [pinia] } });
}

describe('EditorPane', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows an empty state when no file is open', () => {
    const wrapper = mountPane();
    expect(wrapper.text()).toContain('Select a file in the Explorer to edit it.');
    // No toolbar/save button until a file is open.
    expect(wrapper.find('.editor-pane__bar').exists()).toBe(false);
  });

  it('shows the path and an unsaved marker when the buffer is dirty', async () => {
    const wrapper = mountPane();
    const files = useFilesStore();

    // Set path + dirty but leave contents null so the lazy Monaco editor
    // (which can't run in jsdom) is not mounted — we only assert the bar.
    files.openPath = 'studio/pages/home.json';
    files.dirty = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.editor-pane__bar').exists()).toBe(true);
    expect(wrapper.text()).toContain('studio/pages/home.json');
    expect(wrapper.find('.editor-pane__dot').exists()).toBe(true);
  });
});
