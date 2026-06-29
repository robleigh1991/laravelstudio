import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StTextInput from './StTextInput.vue';

describe('StTextInput', () => {
  it('renders the bound value and placeholder', () => {
    const wrapper = mount(StTextInput, {
      props: { modelValue: 'Welcome', placeholder: 'Headline' },
    });
    const input = wrapper.get('input').element as HTMLInputElement;
    expect(input.value).toBe('Welcome');
    expect(input.placeholder).toBe('Headline');
  });

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(StTextInput);
    await wrapper.get('input').setValue('Hello');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello']);
  });

  it('exposes an accessible label', () => {
    const wrapper = mount(StTextInput, { props: { ariaLabel: 'Headline' } });
    expect(wrapper.get('input').attributes('aria-label')).toBe('Headline');
  });
});
