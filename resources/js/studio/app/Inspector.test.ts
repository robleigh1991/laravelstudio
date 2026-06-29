import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Inspector from './Inspector.vue';
import { usePageStore } from './stores/page';
import { useEditorStore } from './stores/editor';

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

    expect((wrapper.get('[aria-label="Headline"]').element as HTMLInputElement).value).toBe('Hi');
    expect(wrapper.get('[aria-label="Subheadline"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('hero');
  });

  it('edits the selected block props live', async () => {
    const wrapper = mountInspector();
    const page = usePageStore();
    page.load(pageJson);
    page.select('b1');
    await wrapper.vm.$nextTick();

    await wrapper.get('[aria-label="Headline"]').setValue('Updated headline');

    expect(page.findBlock('b1')?.props?.headline).toBe('Updated headline');
    expect(page.dirty).toBe(true);
  });

  it('edits classes scoped to the active breakpoint', async () => {
    const wrapper = mountInspector();
    const page = usePageStore();
    const editor = useEditorStore();
    page.load(pageJson);
    page.select('b1');
    editor.setBreakpoint('md');
    await wrapper.vm.$nextTick();

    await wrapper.get('[aria-label="Classes"]').setValue('py-20 bg-gray-100');

    expect(page.findBlock('b1')?.classes?.md).toEqual(['py-20', 'bg-gray-100']);
    // The base breakpoint is untouched.
    expect(page.findBlock('b1')?.classes?.base).toBeUndefined();
  });

  it('marks breakpoints that have overrides', async () => {
    const wrapper = mountInspector();
    const page = usePageStore();
    page.load(pageJson);
    page.select('b1');
    page.updateClasses('b1', 'md', ['py-20']);
    await wrapper.vm.$nextTick();

    expect(wrapper.get('[data-bp="md"]').classes()).toContain('inspector__bp--set');
    expect(wrapper.get('[data-bp="base"]').classes()).not.toContain('inspector__bp--set');
  });

  it('resets the active breakpoint back to inherit', async () => {
    const wrapper = mountInspector();
    const page = usePageStore();
    const editor = useEditorStore();
    page.load(pageJson);
    page.select('b1');
    editor.setBreakpoint('md');
    page.updateClasses('b1', 'md', ['py-20']);
    await wrapper.vm.$nextTick();

    const reset = wrapper.findAll('button').find((b) => b.text() === 'Reset');
    await reset?.trigger('click');

    expect(page.findBlock('b1')?.classes?.md).toBeUndefined();
  });
});
