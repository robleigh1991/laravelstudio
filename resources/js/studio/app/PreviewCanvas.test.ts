import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';

vi.mock('./api', () => ({
  renderPreview: vi.fn(),
}));

import { renderPreview } from './api';
import PreviewCanvas from './PreviewCanvas.vue';

const mockedRender = vi.mocked(renderPreview);

describe('PreviewCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the returned HTML into the iframe srcdoc', async () => {
    mockedRender.mockResolvedValue('<section>Hello preview</section>');

    const wrapper = mount(PreviewCanvas, { props: { blocks: [{ id: 'b1', type: 'hero' }], width: 390 } });
    await flushPromises();

    const iframe = wrapper.get('iframe');
    expect(mockedRender).toHaveBeenCalledWith([{ id: 'b1', type: 'hero' }]);
    expect(iframe.attributes('srcdoc')).toContain('Hello preview');
    expect(iframe.attributes('srcdoc')).toContain('@tailwindcss/browser');
  });

  it('sets the iframe width from the breakpoint', async () => {
    mockedRender.mockResolvedValue('<div></div>');

    const wrapper = mount(PreviewCanvas, { props: { blocks: [], width: 1024 } });
    await flushPromises();

    expect(wrapper.get('iframe').attributes('style')).toContain('1024px');
  });

  it('shows an error when rendering fails', async () => {
    mockedRender.mockRejectedValue(new Error('boom'));

    const wrapper = mount(PreviewCanvas, { props: { blocks: [], width: 390 } });
    await flushPromises();

    expect(wrapper.find('.preview__error').text()).toBe('boom');
  });
});
