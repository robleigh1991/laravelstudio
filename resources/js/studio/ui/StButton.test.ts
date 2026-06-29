import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StButton from './StButton.vue';

describe('StButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(StButton, { slots: { default: 'Publish' } });
    expect(wrapper.text()).toBe('Publish');
  });

  it('applies variant and size classes', () => {
    const wrapper = mount(StButton, { props: { variant: 'primary', size: 'sm' } });
    expect(wrapper.classes()).toContain('st-btn--primary');
    expect(wrapper.classes()).toContain('st-btn--sm');
  });

  it('defaults to a secondary, medium button of type button', () => {
    const wrapper = mount(StButton);
    expect(wrapper.classes()).toContain('st-btn--secondary');
    expect(wrapper.classes()).toContain('st-btn--md');
    expect(wrapper.attributes('type')).toBe('button');
  });

  it('emits click when pressed', async () => {
    const wrapper = mount(StButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('is disabled when the disabled prop is set', () => {
    const wrapper = mount(StButton, { props: { disabled: true } });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
