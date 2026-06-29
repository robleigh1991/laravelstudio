import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('./api', () => ({
  fetchTree: vi.fn(),
  fetchFile: vi.fn(),
}));

import { fetchTree, fetchFile } from './api';
import Explorer from './Explorer.vue';

const mockedTree = vi.mocked(fetchTree);
const mockedFile = vi.mocked(fetchFile);

function mountExplorer() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(Explorer, { global: { plugins: [pinia] }, attachTo: document.body });
}

describe('Explorer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the root tree from the api', async () => {
    mockedTree.mockResolvedValue({
      path: '',
      entries: [
        { name: 'views', type: 'dir', path: 'views' },
        { name: 'home.json', type: 'file', path: 'home.json' },
      ],
    });

    const wrapper = mountExplorer();
    await flushPromises();

    expect(wrapper.text()).toContain('views');
    expect(wrapper.text()).toContain('home.json');
  });

  it('expands a directory and loads its children', async () => {
    mockedTree
      .mockResolvedValueOnce({ path: '', entries: [{ name: 'views', type: 'dir', path: 'views' }] })
      .mockResolvedValueOnce({
        path: 'views',
        entries: [{ name: 'welcome.blade.php', type: 'file', path: 'views/welcome.blade.php' }],
      });

    const wrapper = mountExplorer();
    await flushPromises();

    await wrapper.get('.st-tree-row__chevron').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('welcome.blade.php');
  });

  it('opens a file when a file row is clicked', async () => {
    mockedTree.mockResolvedValue({
      path: '',
      entries: [{ name: 'home.json', type: 'file', path: 'home.json' }],
    });
    mockedFile.mockResolvedValue({ path: 'home.json', contents: '{}' });

    const wrapper = mountExplorer();
    await flushPromises();

    const row = wrapper.findAll('.st-tree-row').find((r) => r.text().includes('home.json'));
    await row?.trigger('click');
    await flushPromises();

    expect(mockedFile).toHaveBeenCalledWith('home.json');
  });
});
