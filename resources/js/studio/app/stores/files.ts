import { defineStore } from 'pinia';
import {
  fetchTree,
  fetchFile,
  saveFile,
  renameFile,
  duplicateFile,
  deleteFile,
  type FileEntry,
} from '../api';

function parentOf(path: string): string {
  const index = path.lastIndexOf('/');
  return index === -1 ? '' : path.slice(0, index);
}

/**
 * Explorer + open-file state, backed by the studio/api filesystem endpoints.
 * Directory children are lazy-loaded and cached on first expand.
 */
export const useFilesStore = defineStore('files', {
  state: () => ({
    root: [] as FileEntry[],
    children: {} as Record<string, FileEntry[]>,
    expanded: {} as Record<string, boolean>,
    openPath: null as string | null,
    openContents: null as string | null,
    dirty: false,
    error: null as string | null,
  }),
  actions: {
    async loadRoot() {
      try {
        this.root = (await fetchTree('')).entries;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load files.';
      }
    },

    async toggleDir(path: string) {
      this.expanded[path] = !this.expanded[path];
      if (this.expanded[path] && this.children[path] === undefined) {
        try {
          this.children[path] = (await fetchTree(path)).entries;
        } catch (e) {
          this.error = e instanceof Error ? e.message : 'Failed to load directory.';
        }
      }
    },

    async openFile(path: string) {
      this.openPath = path;
      try {
        this.openContents = (await fetchFile(path)).contents;
        this.dirty = false;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to open file.';
      }
    },

    setOpenContents(value: string) {
      this.openContents = value;
      this.dirty = true;
    },

    async saveOpenFile() {
      if (this.openPath === null || this.openContents === null) {
        return;
      }
      try {
        await saveFile(this.openPath, this.openContents);
        this.dirty = false;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to save file.';
      }
    },

    async refreshDir(dir: string) {
      try {
        const entries = (await fetchTree(dir)).entries;
        if (dir === '') {
          this.root = entries;
        } else {
          this.children[dir] = entries;
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to refresh directory.';
      }
    },

    async renameEntry(from: string, to: string) {
      try {
        await renameFile(from, to);
        await this.refreshDir(parentOf(from));
        if (parentOf(to) !== parentOf(from)) {
          await this.refreshDir(parentOf(to));
        }
        if (this.openPath === from) {
          this.openPath = to;
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to rename.';
      }
    },

    async duplicateEntry(from: string, to: string) {
      try {
        await duplicateFile(from, to);
        await this.refreshDir(parentOf(to));
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to duplicate.';
      }
    },

    async deleteEntry(path: string) {
      try {
        await deleteFile(path);
        await this.refreshDir(parentOf(path));
        if (this.openPath === path) {
          this.openPath = null;
          this.openContents = null;
          this.dirty = false;
        }
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to delete.';
      }
    },

    isExpanded(path: string): boolean {
      return this.expanded[path] === true;
    },
  },
});
