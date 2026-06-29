import { describe, it, expect } from 'vitest';
import { parsePageBlocks } from './page';

describe('parsePageBlocks', () => {
  it('returns the blocks array from a page document', () => {
    const json = JSON.stringify({ title: 'Home', slug: 'home', blocks: [{ id: 'b1', type: 'hero' }] });
    expect(parsePageBlocks(json)).toEqual([{ id: 'b1', type: 'hero' }]);
  });

  it('returns null for null contents', () => {
    expect(parsePageBlocks(null)).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    expect(parsePageBlocks('<?php echo 1;')).toBeNull();
  });

  it('returns null when there is no blocks array', () => {
    expect(parsePageBlocks(JSON.stringify({ title: 'x' }))).toBeNull();
    expect(parsePageBlocks(JSON.stringify({ blocks: 'nope' }))).toBeNull();
  });
});
