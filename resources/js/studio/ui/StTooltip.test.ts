import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StTooltip from './StTooltip.vue';

describe('StTooltip', () => {
  it('renders the trigger slot and the tooltip label', () => {
    const wrapper = mount(StTooltip, {
      props: { label: 'Resets to inherit' },
      slots: { default: 'Reset' },
    });
    expect(wrapper.get('.st-tooltip__trigger').text()).toBe('Reset');
    const bubble = wrapper.get('[role="tooltip"]');
    expect(bubble.text()).toBe('Resets to inherit');
  });
});
