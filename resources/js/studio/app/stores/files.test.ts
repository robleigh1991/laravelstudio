import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../api', () => ({
  fetchTree: vi.fn(),
  fetchFile: vi.fn(),
  saveFile: vi.fn(),
  renameFile: vi.fn(),
  duplicateFile: vi.fn(),
  deleteFile: vi.fn(),
}));

import { fetchTree, fetchFile, saveFile, renameFile, duplicateFile, deleteFile } from '../api';
import { useFilesStore } from './files';

const mockedTree = vi.mocked(fetchTree);
const mockedFile = vi.mocked(fetchFile);
const mockedSave = vi.mocked(saveFile);
const mockedRename = vi.mocked(renameFile);
const mockedDuplicate = vi.mocked(duplicateFile);
const mockedDelete = vi.mocked(deleteFile);

describe('files store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('loads the root entries', async () => {
    mockedTree.mockResolvedValue({
      path: '',
      entries: [{ name: 'views', type: 'dir', path: 'views' }],
    });

    const files = useFilesStore();
    await files.loadRoot();

    expect(files.root).toHaveLength(1);
    expect(files.root[0].name).toBe('views');
  });

  it('lazy-loads directory children only once', async () => {
    mockedTree.mockResolvedValue({
      path: 'views',
      entries: [{ name: 'pages', type: 'dir', path: 'views/pages' }],
    });

    const files = useFilesStore();
    await files.toggleDir('views');

    expect(files.isExpanded('views')).toBe(true);
    expect(files.children['views']).toHaveLength(1);
    expect(mockedTree).toHaveBeenCalledTimes(1);

    await files.toggleDir('views'); // collapse
    await files.toggleDir('views'); // re-expand — should not refetch
    expect(mockedTree).toHaveBeenCalledTimes(1);
  });

  it('opens a file and stores its contents', async () => {
    mockedFile.mockResolvedValue({ path: 'studio/pages/home.json', contents: '{"slug":"home"}' });

    const files = useFilesStore();
    await files.openFile('studio/pages/home.json');

    expect(files.openPath).toBe('studio/pages/home.json');
    expect(files.openContents).toBe('{"slug":"home"}');
  });

  it('records an error when loading fails', async () => {
    mockedTree.mockRejectedValue(new Error('boom'));

    const files = useFilesStore();
    await files.loadRoot();

    expect(files.error).toBe('boom');
  });

  it('marks the buffer dirty when contents change', () => {
    const files = useFilesStore();
    files.setOpenContents('new contents');

    expect(files.openContents).toBe('new contents');
    expect(files.dirty).toBe(true);
  });

  it('saves the open file and clears the dirty flag', async () => {
    mockedSave.mockResolvedValue({ saved: true });

    const files = useFilesStore();
    files.openPath = 'studio/pages/home.json';
    files.setOpenContents('{"slug":"home"}');

    await files.saveOpenFile();

    expect(mockedSave).toHaveBeenCalledWith('studio/pages/home.json', '{"slug":"home"}');
    expect(files.dirty).toBe(false);
  });

  it('does not call the API when there is no open file', async () => {
    const files = useFilesStore();
    await files.saveOpenFile();

    expect(mockedSave).not.toHaveBeenCalled();
  });

  it('renames an entry and refreshes the parent directory', async () => {
    mockedRename.mockResolvedValue({ renamed: true });
    mockedTree.mockResolvedValue({ path: 'studio/pages', entries: [] });

    const files = useFilesStore();
    files.openPath = 'studio/pages/home.json';
    await files.renameEntry('studio/pages/home.json', 'studio/pages/index.json');

    expect(mockedRename).toHaveBeenCalledWith('studio/pages/home.json', 'studio/pages/index.json');
    expect(mockedTree).toHaveBeenCalledWith('studio/pages');
    // Open path follows the rename.
    expect(files.openPath).toBe('studio/pages/index.json');
  });

  it('duplicates an entry and refreshes its directory', async () => {
    mockedDuplicate.mockResolvedValue({ duplicated: true });
    mockedTree.mockResolvedValue({ path: 'studio/pages', entries: [] });

    const files = useFilesStore();
    await files.duplicateEntry('studio/pages/home.json', 'studio/pages/home-copy.json');

    expect(mockedDuplicate).toHaveBeenCalledWith(
      'studio/pages/home.json',
      'studio/pages/home-copy.json',
    );
    expect(mockedTree).toHaveBeenCalledWith('studio/pages');
  });

  it('deletes an entry and closes it if open', async () => {
    mockedDelete.mockResolvedValue({ deleted: true });
    mockedTree.mockResolvedValue({ path: 'studio/pages', entries: [] });

    const files = useFilesStore();
    files.openPath = 'studio/pages/home.json';
    files.openContents = '{}';
    await files.deleteEntry('studio/pages/home.json');

    expect(mockedDelete).toHaveBeenCalledWith('studio/pages/home.json');
    expect(files.openPath).toBeNull();
    expect(files.openContents).toBeNull();
  });

  it('confirmRename joins the new name to the parent and clears the target', async () => {
    mockedRename.mockResolvedValue({ renamed: true });
    mockedTree.mockResolvedValue({ path: 'studio/pages', entries: [] });

    const files = useFilesStore();
    files.requestRename({ name: 'home.json', type: 'file', path: 'studio/pages/home.json' });
    await files.confirmRename('index.json');

    expect(mockedRename).toHaveBeenCalledWith('studio/pages/home.json', 'studio/pages/index.json');
    expect(files.renameTarget).toBeNull();
  });

  it('confirmDelete deletes the pending target', async () => {
    mockedDelete.mockResolvedValue({ deleted: true });
    mockedTree.mockResolvedValue({ path: 'studio/pages', entries: [] });

    const files = useFilesStore();
    files.requestDelete({ name: 'home.json', type: 'file', path: 'studio/pages/home.json' });
    await files.confirmDelete();

    expect(mockedDelete).toHaveBeenCalledWith('studio/pages/home.json');
    expect(files.deleteTarget).toBeNull();
  });
});
