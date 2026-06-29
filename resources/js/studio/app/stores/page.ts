import { defineStore } from 'pinia';
import type { Block } from '../../types/block';
import { parsePage } from '../editor/page';

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
  }),
  actions: {
    load(contents: string | null): boolean {
      const parsed = parsePage(contents);
      if (parsed === null) {
        this.title = '';
        this.slug = '';
        this.blocks = [];
        this.isPage = false;
        this.selectedId = null;
        return false;
      }

      this.title = parsed.title;
      this.slug = parsed.slug;
      this.blocks = parsed.blocks as Block[];
      this.isPage = true;
      this.selectedId = null;
      return true;
    },

    serialize(): string {
      const page = { title: this.title, slug: this.slug, blocks: this.blocks };
      return `${JSON.stringify(page, null, 4)}\n`;
    },

    select(id: string | null) {
      this.selectedId = id;
    },

    findBlock(id: string): Block | undefined {
      return findIn(this.blocks, id);
    },

    updateProps(id: string, props: Record<string, unknown>) {
      const block = findIn(this.blocks, id);
      if (block) {
        block.props = { ...(block.props ?? {}), ...props };
      }
    },
  },
});
