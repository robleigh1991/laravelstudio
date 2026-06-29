import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StPopover from './StPopover.vue';

describe('StPopover', () => {
  it('renders the trigger slot and is closed by default', () => {
    const wrapper = mount(StPopover, {
      slots: { trigger: 'Options', default: 'Panel body' },
    });
    expect(wrapper.text()).toContain('Options');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('opens and closes the panel when the trigger is clicked', async () => {
    const wrapper = mount(StPopover, {
      slots: { trigger: 'Options', default: 'Panel body' },
    });

    await wrapper.get('.st-popover__trigger').trigger('click');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Panel body');

    await wrapper.get('.st-popover__trigger').trigger('click');
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });
});
