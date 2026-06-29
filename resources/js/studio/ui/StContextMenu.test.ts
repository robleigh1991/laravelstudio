import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import StContextMenu from './StContextMenu.vue';

const items = [
  { label: 'Rename', value: 'rename' },
  { label: 'Duplicate', value: 'duplicate' },
  { label: 'Delete', value: 'delete' },
];

describe('StContextMenu', () => {
  it('is closed until the target is right-clicked', () => {
    const wrapper = mount(StContextMenu, { props: { items }, slots: { default: 'Target' } });
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  });

  it('opens a menu of items on context menu', async () => {
    const wrapper = mount(StContextMenu, { props: { items }, slots: { default: 'Target' } });
    await wrapper.trigger('contextmenu');
    expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    expect(wrapper.findAll('[role="menuitem"]')).toHaveLength(3);
  });

  it('emits select and closes when an item is chosen', async () => {
    const wrapper = mount(StContextMenu, { props: { items }, slots: { default: 'Target' } });
    await wrapper.trigger('contextmenu');
    const del = wrapper.findAll('[role="menuitem"]').find((i) => i.text() === 'Delete');
    await del?.trigger('click');
    expect(wrapper.emitted('select')?.[0]).toEqual(['delete']);
    expect(wrapper.find('[role="menu"]').exists()).toBe(false);
  });
});
