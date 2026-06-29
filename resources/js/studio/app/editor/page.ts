export interface ParsedPage {
  title: string;
  slug: string;
  blocks: unknown[];
}

/**
 * Parse a page's JSON contents into title/slug/blocks, or null if the text
 * isn't a page document. Pure + testable — the page store uses it to decide
 * whether the open file is an editable page.
 */
export function parsePage(contents: string | null): ParsedPage | null {
  if (contents === null) {
    return null;
  }

  try {
    const data: unknown = JSON.parse(contents);
    if (
      data !== null &&
      typeof data === 'object' &&
      Array.isArray((data as { blocks?: unknown }).blocks)
    ) {
      const page = data as { title?: unknown; slug?: unknown; blocks: unknown[] };
      return {
        title: typeof page.title === 'string' ? page.title : '',
        slug: typeof page.slug === 'string' ? page.slug : '',
        blocks: page.blocks,
      };
    }
    return null;
  } catch {
    return null;
  }
}
