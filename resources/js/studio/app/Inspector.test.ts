import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Inspector from './Inspector.vue';
import { usePageStore } from './stores/page';

const pageJson = JSON.stringify({
  blocks: [{ id: 'b1', type: 'hero', props: { headline: 'Hi' } }],
});

function mountInspector() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(Inspector, { global: { plugins: [pinia] } });
}

describe('Inspector', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('prompts when nothing is selected', () => {
    const wrapper = mountInspector();
    expect(wrapper.text()).toContain('Select an element');
  });

  it('renders the registered fields for the selected block', async () => {
    const wrapper = mountInspector();
    const page = usePageStore();
    page.load(pageJson);
    page.select('b1');
    await wrapper.vm.$nextTick();

    const inputs = wrapper.findAll('input');
    expect(inputs).toHaveLength(4); // hero has 4 text fields
    expect((inputs[0].element as HTMLInputElement).value).toBe('Hi');
    expect(wrapper.text()).toContain('hero');
  });

  it('edits the selected block props live', async () => {
    const wrapper = mountInspector();
    const page = usePageStore();
    page.load(pageJson);
    page.select('b1');
    await wrapper.vm.$nextTick();

    await wrapper.findAll('input')[0].setValue('Updated headline');

    expect(page.findBlock('b1')?.props?.headline).toBe('Updated headline');
    expect(page.dirty).toBe(true);
  });
});
