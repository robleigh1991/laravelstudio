import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useEditorStore } from './editor';

describe('editor store', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it('defaults to the dark theme and mobile breakpoint', () => {
    const editor = useEditorStore();
    expect(editor.theme).toBe('dark');
    expect(editor.breakpoint).toBe('base');
  });

  it('toggles the theme and persists it', () => {
    const editor = useEditorStore();
    editor.toggleTheme();
    expect(editor.theme).toBe('light');
    expect(localStorage.getItem('studio.theme')).toBe('"light"');
  });

  it('sets the breakpoint', () => {
    const editor = useEditorStore();
    editor.setBreakpoint('lg');
    expect(editor.breakpoint).toBe('lg');
  });

  it('clamps rail widths to their minimums', () => {
    const editor = useEditorStore();
    editor.setLeftWidth(50);
    editor.setRightWidth(50);
    expect(editor.leftWidth).toBe(200);
    expect(editor.rightWidth).toBe(280);
  });

  it('persists rail widths', () => {
    const editor = useEditorStore();
    editor.setLeftWidth(320);
    expect(localStorage.getItem('studio.leftWidth')).toBe('320');
  });

  it('toggles rail collapse', () => {
    const editor = useEditorStore();
    expect(editor.leftCollapsed).toBe(false);
    editor.toggleLeft();
    expect(editor.leftCollapsed).toBe(true);
  });
});
