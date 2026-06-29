import { defineStore } from 'pinia';

export type Theme = 'dark' | 'light';
export type Breakpoint = 'base' | 'md' | 'lg';

const MIN_LEFT = 200;
const MIN_RIGHT = 280;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, tests) — non-fatal.
  }
}

/**
 * Editor chrome state: theme, the active editing breakpoint, and rail widths.
 * Persisted to localStorage so the layout survives reloads.
 */
export const useEditorStore = defineStore('editor', {
  state: () => ({
    theme: load<Theme>('studio.theme', 'dark'),
    breakpoint: 'base' as Breakpoint,
    leftWidth: load<number>('studio.leftWidth', 240),
    rightWidth: load<number>('studio.rightWidth', 300),
    leftCollapsed: false,
    rightCollapsed: false,
  }),
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      save('studio.theme', this.theme);
    },
    setBreakpoint(breakpoint: Breakpoint) {
      this.breakpoint = breakpoint;
    },
    setLeftWidth(width: number) {
      this.leftWidth = Math.max(MIN_LEFT, Math.round(width));
      save('studio.leftWidth', this.leftWidth);
    },
    setRightWidth(width: number) {
      this.rightWidth = Math.max(MIN_RIGHT, Math.round(width));
      save('studio.rightWidth', this.rightWidth);
    },
    toggleLeft() {
      this.leftCollapsed = !this.leftCollapsed;
    },
    toggleRight() {
      this.rightCollapsed = !this.rightCollapsed;
    },
  },
});
