import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BreakpointBadge from './BreakpointBadge.vue';

describe('BreakpointBadge', () => {
  it('renders the human label for the active breakpoint key', () => {
    const wrapper = mount(BreakpointBadge, { props: { active: 'md' } });
    expect(wrapper.text()).toBe('Tablet');
    expect(wrapper.attributes('data-breakpoint')).toBe('md');
  });

  it('maps base to Mobile and lg to Desktop', () => {
    expect(mount(BreakpointBadge, { props: { active: 'base' } }).text()).toBe('Mobile');
    expect(mount(BreakpointBadge, { props: { active: 'lg' } }).text()).toBe('Desktop');
  });
});
