import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('./api', () => ({
  fetchTree: vi.fn().mockResolvedValue({ path: '', entries: [] }),
  fetchFile: vi.fn(),
  saveFile: vi.fn(),
  renameFile: vi.fn(),
  duplicateFile: vi.fn().mockResolvedValue({ duplicated: true }),
  deleteFile: vi.fn(),
}));

import { duplicateFile } from './api';
import ExplorerNode from './ExplorerNode.vue';
import { useFilesStore } from './stores/files';

const entry = { name: 'home.json', type: 'file' as const, path: 'studio/pages/home.json' };

function mountNode() {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(ExplorerNode, {
    props: { entry, depth: 0 },
    global: { plugins: [pinia] },
    attachTo: document.body,
  });
}

async function openMenuItem(wrapper: ReturnType<typeof mountNode>, label: string) {
  await wrapper.get('.st-ctx').trigger('contextmenu');
  const item = wrapper.findAll('[role="menuitem"]').find((i) => i.text() === label);
  await item?.trigger('click');
}

describe('ExplorerNode context menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests a rename', async () => {
    const wrapper = mountNode();
    const files = useFilesStore();
    await openMenuItem(wrapper, 'Rename');
    expect(files.renameTarget?.path).toBe(entry.path);
  });

  it('requests a delete', async () => {
    const wrapper = mountNode();
    const files = useFilesStore();
    await openMenuItem(wrapper, 'Delete');
    expect(files.deleteTarget?.path).toBe(entry.path);
  });

  it('duplicates with a -copy name', async () => {
    const wrapper = mountNode();
    await openMenuItem(wrapper, 'Duplicate');
    expect(duplicateFile).toHaveBeenCalledWith(
      'studio/pages/home.json',
      'studio/pages/home-copy.json',
    );
  });
});
