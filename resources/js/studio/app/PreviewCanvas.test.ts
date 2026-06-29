import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

vi.mock('./api', () => ({
  renderPreview: vi.fn(),
}));

import { renderPreview } from './api';
import PreviewCanvas from './PreviewCanvas.vue';

const mockedRender = vi.mocked(renderPreview);

function mountPreview(props: { blocks?: unknown[]; width?: number; selectedId?: string | null } = {}) {
  return mount(PreviewCanvas, {
    props: { blocks: [], width: 390, selectedId: null, ...props },
    attachTo: document.body,
  });
}

describe('PreviewCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRender.mockResolvedValue('<div></div>');
  });

  it('renders the returned HTML and the select bridge into the iframe srcdoc', async () => {
    mockedRender.mockResolvedValue('<section data-studio-id="b1">Hello preview</section>');

    const wrapper = mountPreview({ blocks: [{ id: 'b1', type: 'hero' }] });
    await flushPromises();

    const srcdoc = wrapper.get('iframe').attributes('srcdoc') ?? '';
    expect(mockedRender).toHaveBeenCalledWith([{ id: 'b1', type: 'hero' }]);
    expect(srcdoc).toContain('Hello preview');
    expect(srcdoc).toContain('@tailwindcss/browser');
    expect(srcdoc).toContain('studio-preview');
  });

  it('sets the iframe width from the breakpoint', async () => {
    const wrapper = mountPreview({ width: 1024 });
    await flushPromises();
    expect(wrapper.get('iframe').attributes('style')).toContain('1024px');
  });

  it('emits select when the iframe posts a selection message', async () => {
    const wrapper = mountPreview();
    await flushPromises();

    window.dispatchEvent(
      new MessageEvent('message', {
        data: { source: 'studio-preview', type: 'select', id: 'b1' },
      }),
    );
    await flushPromises();

    expect(wrapper.emitted('select')?.[0]).toEqual(['b1']);
    wrapper.unmount();
  });

  it('ignores foreign messages', async () => {
    const wrapper = mountPreview();
    await flushPromises();

    window.dispatchEvent(new MessageEvent('message', { data: { source: 'evil', id: 'x' } }));
    await flushPromises();

    expect(wrapper.emitted('select')).toBeUndefined();
    wrapper.unmount();
  });

  it('shows an error when rendering fails', async () => {
    mockedRender.mockRejectedValue(new Error('boom'));

    const wrapper = mountPreview();
    await flushPromises();

    expect(wrapper.find('.preview__error').text()).toBe('boom');
  });
});
