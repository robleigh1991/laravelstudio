import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StSelect from './StSelect.vue';

const options = [
  { value: 'bold', label: 'Bold' },
  { value: 'normal', label: 'Normal' },
];

describe('StSelect', () => {
  it('renders all options and reflects the model value', () => {
    const wrapper = mount(StSelect, { props: { modelValue: 'normal', options } });
    expect(wrapper.findAll('option')).toHaveLength(2);
    expect((wrapper.get('select').element as HTMLSelectElement).value).toBe('normal');
  });

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(StSelect, { props: { modelValue: 'bold', options } });
    await wrapper.get('select').setValue('normal');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['normal']);
  });
});
