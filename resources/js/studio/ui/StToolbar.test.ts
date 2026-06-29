import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StToolbar from './StToolbar.vue';

describe('StToolbar', () => {
  it('exposes a toolbar role with an accessible label', () => {
    const wrapper = mount(StToolbar, { props: { ariaLabel: 'Editor' } });
    expect(wrapper.attributes('role')).toBe('toolbar');
    expect(wrapper.attributes('aria-label')).toBe('Editor');
  });

  it('renders start, center, and end slots', () => {
    const wrapper = mount(StToolbar, {
      slots: { start: 'L', center: 'C', end: 'R' },
    });
    expect(wrapper.text()).toContain('L');
    expect(wrapper.text()).toContain('C');
    expect(wrapper.text()).toContain('R');
  });
});
