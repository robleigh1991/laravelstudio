import { describe, it, expect } from 'vitest';
import { parsePage } from './page';

describe('parsePage', () => {
  it('parses title, slug, and blocks from a page document', () => {
    const json = JSON.stringify({ title: 'Home', slug: 'home', blocks: [{ id: 'b1', type: 'hero' }] });
    expect(parsePage(json)).toEqual({
      title: 'Home',
      slug: 'home',
      blocks: [{ id: 'b1', type: 'hero' }],
    });
  });

  it('defaults missing title/slug to empty strings', () => {
    const parsed = parsePage(JSON.stringify({ blocks: [] }));
    expect(parsed).toEqual({ title: '', slug: '', blocks: [] });
  });

  it('returns null for null, invalid JSON, or a non-page object', () => {
    expect(parsePage(null)).toBeNull();
    expect(parsePage('<?php echo 1;')).toBeNull();
    expect(parsePage(JSON.stringify({ title: 'x' }))).toBeNull();
    expect(parsePage(JSON.stringify({ blocks: 'nope' }))).toBeNull();
  });
});
