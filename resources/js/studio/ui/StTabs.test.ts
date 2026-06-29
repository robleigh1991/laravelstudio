import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StTabs from './StTabs.vue';

const tabs = [
  { value: 'inspect', label: 'Inspect' },
  { value: 'ai', label: 'AI' },
];

describe('StTabs', () => {
  it('marks the active tab as selected', () => {
    const wrapper = mount(StTabs, { props: { modelValue: 'inspect', tabs } });
    const active = wrapper.findAll('[role="tab"]').find((t) => t.text() === 'Inspect');
    expect(active?.attributes('aria-selected')).toBe('true');
    expect(active?.classes()).toContain('st-tabs__tab--active');
  });

  it('emits the tab value on click', async () => {
    const wrapper = mount(StTabs, { props: { modelValue: 'inspect', tabs } });
    const ai = wrapper.findAll('[role="tab"]').find((t) => t.text() === 'AI');
    await ai?.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['ai']);
  });
});
