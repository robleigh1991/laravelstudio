import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('./api', () => ({
  renderPreview: vi.fn().mockResolvedValue('<section>Rendered page</section>'),
}));

import CanvasPane from './CanvasPane.vue';
import { useFilesStore } from './stores/files';

function mountCanvas() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(CanvasPane, { global: { plugins: [pinia] }, attachTo: document.body });
}

describe('CanvasPane', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('prompts to open a page when nothing previewable is open', () => {
    const wrapper = mountCanvas();
    expect(wrapper.text()).toContain('Open a page');
    expect(wrapper.find('iframe').exists()).toBe(false);
  });

  it('previews the open page through the iframe', async () => {
    const wrapper = mountCanvas();
    const files = useFilesStore();

    // A page document (contents only — no openPath, so Code view stays Monaco-free).
    files.openContents = JSON.stringify({ blocks: [{ id: 'b1', type: 'hero' }] });
    await flushPromises();

    expect(wrapper.find('iframe').exists()).toBe(true);
    expect(wrapper.find('iframe').attributes('srcdoc')).toContain('Rendered page');
  });

  it('switches to the code view', async () => {
    const wrapper = mountCanvas();
    const code = wrapper.findAll('[role="tab"]').find((t) => t.text() === 'Code');
    await code?.trigger('click');

    // EditorPane empty state (no file open) replaces the preview.
    expect(wrapper.text()).toContain('Select a file in the Explorer to edit it.');
    expect(wrapper.find('iframe').exists()).toBe(false);
  });
});
