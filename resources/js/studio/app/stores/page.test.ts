import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../api', () => ({
  saveFile: vi.fn().mockResolvedValue({ saved: true }),
}));

import { saveFile } from '../api';
import { usePageStore } from './page';

const mockedSave = vi.mocked(saveFile);

const pageJson = JSON.stringify({
  title: 'Home',
  slug: 'home',
  blocks: [
    { id: 'b1', type: 'hero', props: { headline: 'Hi' } },
    {
      id: 'wrap',
      type: 'container',
      children: [{ id: 'inner', type: 'footer', props: { copyright: '2026' } }],
    },
  ],
});

describe('page store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('loads a page document into editable state', () => {
    const page = usePageStore();
    expect(page.load(pageJson)).toBe(true);
    expect(page.isPage).toBe(true);
    expect(page.title).toBe('Home');
    expect(page.slug).toBe('home');
    expect(page.blocks).toHaveLength(2);
  });

  it('resets and reports false for a non-page file', () => {
    const page = usePageStore();
    page.load(pageJson);
    expect(page.load('<?php echo 1;')).toBe(false);
    expect(page.isPage).toBe(false);
    expect(page.blocks).toHaveLength(0);
  });

  it('finds nested blocks by id', () => {
    const page = usePageStore();
    page.load(pageJson);
    expect(page.findBlock('inner')?.type).toBe('footer');
  });

  it('updates a block\'s props by id', () => {
    const page = usePageStore();
    page.load(pageJson);
    page.updateProps('b1', { headline: 'Updated' });
    expect(page.findBlock('b1')?.props?.headline).toBe('Updated');
  });

  it('tracks the selected block', () => {
    const page = usePageStore();
    page.load(pageJson);
    page.select('b1');
    expect(page.selectedId).toBe('b1');
  });

  it('updates classes for a given breakpoint', () => {
    const page = usePageStore();
    page.load(pageJson);
    page.updateClasses('b1', 'md', ['py-20', 'bg-gray-100']);
    expect(page.findBlock('b1')?.classes?.md).toEqual(['py-20', 'bg-gray-100']);
    expect(page.dirty).toBe(true);
  });

  it('removes a breakpoint key when classes are cleared', () => {
    const page = usePageStore();
    page.load(pageJson);
    page.updateClasses('b1', 'md', ['py-20']);
    page.updateClasses('b1', 'md', []);
    expect(page.findBlock('b1')?.classes?.md).toBeUndefined();
  });

  it('serializes back to JSON that round-trips', () => {
    const page = usePageStore();
    page.load(pageJson);
    const serialized = page.serialize();
    expect(JSON.parse(serialized)).toEqual(JSON.parse(pageJson));
  });

  it('saves the serialized page to its path', async () => {
    const page = usePageStore();
    page.load(pageJson, 'studio/pages/home.json');

    const ok = await page.save();

    expect(ok).toBe(true);
    expect(mockedSave).toHaveBeenCalledWith('studio/pages/home.json', page.serialize());
  });

  it('marks dirty on a prop edit and clears it on save', async () => {
    const page = usePageStore();
    page.load(pageJson, 'studio/pages/home.json');
    expect(page.dirty).toBe(false);

    page.updateProps('b1', { headline: 'X' });
    expect(page.dirty).toBe(true);

    await page.save();
    expect(page.dirty).toBe(false);
  });

  it('does not save when there is no path', async () => {
    const page = usePageStore();
    page.load(pageJson); // no path
    expect(await page.save()).toBe(false);
    expect(mockedSave).not.toHaveBeenCalled();
  });

  it('adds a block, selects it, and marks dirty', () => {
    const page = usePageStore();
    page.load(pageJson);
    const before = page.blocks.length;

    const id = page.addBlock('cta');

    expect(page.blocks).toHaveLength(before + 1);
    expect(page.blocks[page.blocks.length - 1].type).toBe('cta');
    expect(page.selectedId).toBe(id);
    expect(page.dirty).toBe(true);
  });

  it('inserts a block at a given index', () => {
    const page = usePageStore();
    page.load(pageJson);

    page.addBlock('header', 0);

    expect(page.blocks[0].type).toBe('header');
  });

  it('removes a block and clears the selection if it was selected', () => {
    const page = usePageStore();
    page.load(pageJson);
    page.select('b1');

    page.removeBlock('b1');

    expect(page.findBlock('b1')).toBeUndefined();
    expect(page.selectedId).toBeNull();
  });

  it('reorders blocks with moveBlock', () => {
    const page = usePageStore();
    page.load(pageJson);
    const firstId = page.blocks[0].id;

    page.moveBlock(0, 1);

    expect(page.blocks[1].id).toBe(firstId);
    expect(page.dirty).toBe(true);
  });
});
