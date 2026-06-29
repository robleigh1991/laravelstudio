import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StSlider from './StSlider.vue';

describe('StSlider', () => {
  it('reflects the model value', () => {
    const wrapper = mount(StSlider, { props: { modelValue: 30 } });
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('30');
  });

  it('emits a numeric update on input', async () => {
    const wrapper = mount(StSlider, { props: { modelValue: 30, min: 0, max: 100 } });
    await wrapper.get('input').setValue('45');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([45]);
  });

  it('exposes an accessible label', () => {
    const wrapper = mount(StSlider, { props: { modelValue: 0, ariaLabel: 'Font size' } });
    expect(wrapper.get('input').attributes('aria-label')).toBe('Font size');
  });
});
