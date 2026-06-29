/**
 * Extract the block array from a page's JSON contents, or null if the text
 * isn't a page document. Pure + testable — the canvas uses it to decide whether
 * the open file can be previewed.
 */
export function parsePageBlocks(contents: string | null): unknown[] | null {
  if (contents === null) {
    return null;
  }

  try {
    const data: unknown = JSON.parse(contents);
    if (data !== null && typeof data === 'object' && Array.isArray((data as { blocks?: unknown }).blocks)) {
      return (data as { blocks: unknown[] }).blocks;
    }
    return null;
  } catch {
    return null;
  }
}
