import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AppShell from './AppShell.vue';
import { useEditorStore } from './stores/editor';

function mountShell() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(AppShell, { global: { plugins: [pinia] }, attachTo: document.body });
}

describe('AppShell', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the three panes', () => {
    const wrapper = mountShell();
    expect(wrapper.find('[data-pane="explorer"]').exists()).toBe(true);
    expect(wrapper.find('[data-pane="preview"]').exists()).toBe(true);
    expect(wrapper.find('[data-pane="inspector"]').exists()).toBe(true);
  });

  it('exposes the breakpoint switcher and updates the store', async () => {
    const wrapper = mountShell();
    const editor = useEditorStore();

    const desktop = wrapper.findAll('[role="tab"]').find((t) => t.text() === 'Desktop');
    await desktop?.trigger('click');

    expect(editor.breakpoint).toBe('lg');
    expect(wrapper.find('[data-pane="preview"]').text()).toContain('1024 px');
  });

  it('toggles the theme via the toolbar', async () => {
    const wrapper = mountShell();
    const editor = useEditorStore();

    const toggle = wrapper.findAll('button').find((b) => b.text() === 'Light');
    await toggle?.trigger('click');

    expect(editor.theme).toBe('light');
    expect(wrapper.get('.shell').attributes('data-theme')).toBe('light');
  });
});
