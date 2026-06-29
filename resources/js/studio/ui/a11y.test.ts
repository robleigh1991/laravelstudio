import { describe, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { expectNoA11yViolations } from '../testing/axe';

import StButton from './StButton.vue';
import StTextInput from './StTextInput.vue';
import StSelect from './StSelect.vue';
import StSegmented from './StSegmented.vue';
import StTabs from './StTabs.vue';
import StSlider from './StSlider.vue';
import StToolbar from './StToolbar.vue';
import StColorPicker from './StColorPicker.vue';
import StTreeRow from './StTreeRow.vue';
import StModal from './StModal.vue';
import StContextMenu from './StContextMenu.vue';

const options = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

describe('component kit accessibility (axe, WCAG A/AA)', () => {
  it('StButton', async () => {
    const w = mount(StButton, { slots: { default: 'Save' }, attachTo: document.body });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StTextInput', async () => {
    const w = mount(StTextInput, { props: { ariaLabel: 'Headline' }, attachTo: document.body });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StSelect', async () => {
    const w = mount(StSelect, {
      props: { modelValue: 'a', options, ariaLabel: 'Weight' },
      attachTo: document.body,
    });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StSegmented', async () => {
    const w = mount(StSegmented, {
      props: { modelValue: 'a', options, ariaLabel: 'Breakpoint' },
      attachTo: document.body,
    });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StTabs', async () => {
    const w = mount(StTabs, {
      props: { modelValue: 'a', tabs: options, ariaLabel: 'Panel' },
      attachTo: document.body,
    });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StSlider', async () => {
    const w = mount(StSlider, {
      props: { modelValue: 30, ariaLabel: 'Font size' },
      attachTo: document.body,
    });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StToolbar', async () => {
    const w = mount(StToolbar, { props: { ariaLabel: 'Editor' }, attachTo: document.body });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StColorPicker', async () => {
    const w = mount(StColorPicker, {
      props: { modelValue: '#6366f1', ariaLabel: 'Background' },
      attachTo: document.body,
    });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StTreeRow (within a tree)', async () => {
    const w = mount(
      {
        render: () =>
          h('div', { role: 'tree' }, [h(StTreeRow, { label: 'home', active: true })]),
      },
      { attachTo: document.body },
    );
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StModal (open)', async () => {
    const w = mount(StModal, {
      props: { open: true, title: 'Confirm' },
      slots: { default: 'Body' },
      global: { stubs: { teleport: true } },
      attachTo: document.body,
    });
    await expectNoA11yViolations(w.element);
    w.unmount();
  });

  it('StContextMenu (open)', async () => {
    const w = mount(StContextMenu, {
      props: { items: [{ label: 'Rename', value: 'rename' }] },
      slots: { default: 'Target' },
      attachTo: document.body,
    });
    await w.trigger('contextmenu');
    await expectNoA11yViolations(w.element);
    w.unmount();
  });
});
