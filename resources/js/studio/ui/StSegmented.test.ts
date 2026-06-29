import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StSegmented from './StSegmented.vue';

const options = [
  { value: 'base', label: 'Mobile' },
  { value: 'md', label: 'Tablet' },
  { value: 'lg', label: 'Desktop' },
];

describe('StSegmented', () => {
  it('renders all options', () => {
    const wrapper = mount(StSegmented, { props: { modelValue: 'base', options } });
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3);
  });

  it('marks the active option as selected', () => {
    const wrapper = mount(StSegmented, { props: { modelValue: 'md', options } });
    const active = wrapper.findAll('[role="tab"]').find((t) => t.text() === 'Tablet');
    expect(active?.attributes('aria-selected')).toBe('true');
    expect(active?.classes()).toContain('st-segmented__item--active');
  });

  it('emits the option value on click', async () => {
    const wrapper = mount(StSegmented, { props: { modelValue: 'base', options } });
    const desktop = wrapper.findAll('[role="tab"]').find((t) => t.text() === 'Desktop');
    await desktop?.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['lg']);
  });
});
