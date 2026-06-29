import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePageStore } from './page';

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

  it('serializes back to JSON that round-trips', () => {
    const page = usePageStore();
    page.load(pageJson);
    const serialized = page.serialize();
    expect(JSON.parse(serialized)).toEqual(JSON.parse(pageJson));
  });
});
