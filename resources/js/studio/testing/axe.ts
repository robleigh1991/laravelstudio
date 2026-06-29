import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core against a mounted DOM node and asserts no WCAG A/AA violations.
 *
 * Notes:
 *  - color-contrast is disabled here because jsdom has no layout/rendering, so
 *    contrast can't be computed. Contrast is verified separately via the
 *    visual-regression snapshots (Part B) and the token palette.
 *  - A few document-level rules (lang, title, landmarks) are disabled because we
 *    test components in isolation, not full pages.
 */
export async function expectNoA11yViolations(node: Element): Promise<void> {
  const results = await axe.run(node, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    rules: {
      'color-contrast': { enabled: false },
      'html-has-lang': { enabled: false },
      'document-title': { enabled: false },
      'landmark-one-main': { enabled: false },
      region: { enabled: false },
    },
  });

  // Map to rule ids so a failure message names the offending rule.
  expect(results.violations.map((violation) => violation.id)).toEqual([]);
}
