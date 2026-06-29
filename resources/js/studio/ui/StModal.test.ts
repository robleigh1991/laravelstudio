import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StModal from './StModal.vue';

const mountModal = (open: boolean) =>
  mount(StModal, {
    props: { open, title: 'Confirm' },
    slots: { default: 'Are you sure?' },
    global: { stubs: { teleport: true } },
  });

describe('StModal', () => {
  it('renders nothing when closed', () => {
    const wrapper = mountModal(false);
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
  });

  it('renders a labelled dialog with content when open', () => {
    const wrapper = mountModal(true);
    const dialog = wrapper.get('[role="dialog"]');
    expect(dialog.attributes('aria-modal')).toBe('true');
    expect(dialog.attributes('aria-label')).toBe('Confirm');
    expect(wrapper.text()).toContain('Are you sure?');
  });

  it('emits close when the overlay is clicked', async () => {
    const wrapper = mountModal(true);
    await wrapper.get('.st-modal__overlay').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits close on Escape', async () => {
    const wrapper = mountModal(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });
});
