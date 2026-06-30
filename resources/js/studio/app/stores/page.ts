import { defineStore } from 'pinia';
import type { Block, Breakpoint } from '../../types/block';
import { parsePage } from '../editor/page';
import { saveFile } from '../api';

function newBlockId(): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 12);
  return `blk_${rand}`;
}

function findIn(blocks: Block[], id: string): Block | undefined {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    }
    if (block.children) {
      const found = findIn(block.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * The current page as an editable block tree — the source of truth while
 * editing. Loaded from a page's JSON, drives the live preview, serializes back
 * to JSON for saving. This is the backbone Phase 4's inspector edits.
 */
export const usePageStore = defineStore('page', {
  state: () => ({
    title: '',
    slug: '',
    blocks: [] as Block[],
    selectedId: null as string | null,
    isPage: false,
    path: null as string | null,
    dirty: false,
    error: null as string | null,
  }),
  actions: {
    load(contents: string | null, path: string | null = null): boolean {
      const parsed = parsePage(contents);
      this.path = path;
      this.selectedId = null;
      this.dirty = false;

      if (parsed === null) {
        this.title = '';
        this.slug = '';
        this.blocks = [];
        this.isPage = false;
        return false;
      }

      this.title = parsed.title;
      this.slug = parsed.slug;
      this.blocks = parsed.blocks as Block[];
      this.isPage = true;
      return true;
    },

    async save(): Promise<boolean> {
      if (this.path === null || !this.isPage) {
        return false;
      }
      try {
        await saveFile(this.path, this.serialize());
        this.dirty = false;
        return true;
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to save page.';
        return false;
      }
    },

    serialize(): string {
      const page = { title: this.title, slug: this.slug, blocks: this.blocks };
      return `${JSON.stringify(page, null, 4)}\n`;
    },

    select(id: string | null) {
      this.selectedId = id;
    },

    addBlock(type: string, index?: number): string {
      const id = newBlockId();
      const block: Block = { id, type, props: {}, classes: {} };
      const at =
        index === undefined
          ? this.blocks.length
          : Math.max(0, Math.min(index, this.blocks.length));
      this.blocks.splice(at, 0, block);
      this.selectedId = id;
      this.dirty = true;
      return id;
    },

    removeBlock(id: string) {
      const index = this.blocks.findIndex((block) => block.id === id);
      if (index === -1) {
        return;
      }
      this.blocks.splice(index, 1);
      if (this.selectedId === id) {
        this.selectedId = null;
      }
      this.dirty = true;
    },

    moveBlock(from: number, to: number) {
      if (from < 0 || from >= this.blocks.length) {
        return;
      }
      const clampedTo = Math.max(0, Math.min(to, this.blocks.length - 1));
      const [moved] = this.blocks.splice(from, 1);
      this.blocks.splice(clampedTo, 0, moved);
      this.dirty = true;
    },

    findBlock(id: string): Block | undefined {
      return findIn(this.blocks, id);
    },

    updateProps(id: string, props: Record<string, unknown>) {
      const block = findIn(this.blocks, id);
      if (block) {
        block.props = { ...(block.props ?? {}), ...props };
        this.dirty = true;
      }
    },

    updateClasses(id: string, breakpoint: Breakpoint, classes: string[]) {
      const block = findIn(this.blocks, id);
      if (!block) {
        return;
      }
      const map = { ...(block.classes ?? {}) };
      if (classes.length === 0) {
        delete map[breakpoint];
      } else {
        map[breakpoint] = classes;
      }
      block.classes = map;
      this.dirty = true;
    },
  },
});
