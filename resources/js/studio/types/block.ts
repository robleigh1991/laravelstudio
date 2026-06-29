// Canonical block-tree types. Mirror of docs/block-schema.md and the PHP DTOs.
// The inspector, canvas, and AI panel all operate on these shapes.

export const BREAKPOINTS = ['base', 'sm', 'md', 'lg', 'xl', '2xl', 'dark'] as const;
export type Breakpoint = (typeof BREAKPOINTS)[number];

/** Per-breakpoint Tailwind utilities. `base` is mobile-first (no prefix). */
export type ClassMap = Partial<Record<Breakpoint, string[]>>;

export interface Block {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  classes?: ClassMap;
  children?: Block[];
}

export interface Page {
  title: string;
  slug: string;
  blocks: Block[];
}

/** Editing breakpoints exposed in the toolbar switcher → which ClassMap key they write to. */
export const EDIT_BREAKPOINTS: { label: string; key: Breakpoint; minWidth: number }[] = [
  { label: 'Mobile', key: 'base', minWidth: 0 },
  { label: 'Tablet', key: 'md', minWidth: 768 },
  { label: 'Desktop', key: 'lg', minWidth: 1024 },
];
