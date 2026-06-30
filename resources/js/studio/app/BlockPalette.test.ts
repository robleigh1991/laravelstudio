import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import BlockPalette from './BlockPalette.vue';
import { usePageStore } from './stores/page';

const pageJson = JSON.stringify({ blocks: [{ id: 'b1', type: 'hero' }] });

function mountPalette() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(BlockPalette, { global: { plugins: [pinia] }, attachTo: document.body });
}

describe('BlockPalette', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('lists components and adds one on click', async () => {
    const wrapper = mountPalette();
    const page = usePageStore();
    page.load(pageJson);
    const before = page.blocks.length;

    await wrapper.get('.st-popover__trigger').trigger('click');
    const item = wrapper.findAll('[role="menuitem"]').find((i) => i.text() === 'Call to action');
    await item?.trigger('click');

    expect(page.blocks).toHaveLength(before + 1);
    expect(page.blocks.some((b) => b.type === 'cta')).toBe(true);
  });
});
