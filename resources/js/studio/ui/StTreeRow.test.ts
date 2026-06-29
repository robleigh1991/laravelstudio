import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StTreeRow from './StTreeRow.vue';

describe('StTreeRow', () => {
  it('renders the label and marks active state', () => {
    const wrapper = mount(StTreeRow, { props: { label: 'home', active: true } });
    expect(wrapper.text()).toContain('home');
    expect(wrapper.attributes('aria-selected')).toBe('true');
    expect(wrapper.classes()).toContain('st-tree-row--active');
  });

  it('emits click when the row is pressed', async () => {
    const wrapper = mount(StTreeRow, { props: { label: 'about' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('shows a chevron for expandable rows and emits toggle without selecting', async () => {
    const wrapper = mount(StTreeRow, {
      props: { label: 'Pages', expandable: true, expanded: false },
    });
    expect(wrapper.attributes('aria-expanded')).toBe('false');
    await wrapper.get('.st-tree-row__chevron').trigger('click');
    expect(wrapper.emitted('toggle')).toHaveLength(1);
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
