import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StColorPicker from './StColorPicker.vue';

describe('StColorPicker', () => {
  it('reflects the model value in both the swatch and the hex field', () => {
    const wrapper = mount(StColorPicker, { props: { modelValue: '#6366f1' } });
    expect((wrapper.get('.st-color__swatch').element as HTMLInputElement).value).toBe('#6366f1');
    expect((wrapper.get('.st-color__hex').element as HTMLInputElement).value).toBe('#6366f1');
  });

  it('emits update:modelValue when the hex field changes', async () => {
    const wrapper = mount(StColorPicker, { props: { modelValue: '#6366f1' } });
    await wrapper.get('.st-color__hex').setValue('#ffffff');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#ffffff']);
  });
});
