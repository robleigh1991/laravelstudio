import { defineStore } from 'pinia';
import { fetchTree, fetchFile, saveFile, type FileEntry } from '../api';

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

    isExpanded(path: string): boolean {
      return this.expanded[path] === true;
    },
  },
});
