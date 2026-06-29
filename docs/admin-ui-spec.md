# Admin UI — interaction & layout spec

How the editor chrome behaves. The visual system lives in `resources/css/studio-tokens.css`;
the component kit in `resources/js/studio/ui/`. This document is the behavioural
contract those pieces are assembled against, so panels stay consistent across phases.

## Layout

The editor is a three-pane application shell, dark-first (see the approved mockup):

```
┌─────────────────────────────────────────────────────────────┐
│ Title bar — project · page · branch                           │
├─────────────────────────────────────────────────────────────┤
│ Toolbar — menu · [breakpoint switcher] · undo/redo · Publish  │
├───────────┬───────────────────────────────────┬─────────────┤
│ Explorer  │ Live preview (canvas)             │ Inspector    │
│ + Layers  │   breakpoint-width device frame    │ + AI (tabs)  │
└───────────┴───────────────────────────────────┴─────────────┘
```

- Left and right rails are independently **resizable** (drag the divider) and
  **collapsible**. Minimum widths: left 200px, right 280px. Widths persist per
  user (localStorage; later, per project).
- The canvas fills remaining space and never scrolls horizontally — the device
  frame inside it is what changes width with the breakpoint.
- Maximum two floating layers at once (popover/menu). A third interaction is a
  modal, not a popover-on-popover.

## Density

Compact, pro-tool density throughout: 26px small controls / 32px default, 13px
base text. This is deliberate — it matches the density of VS Code and Linear and
keeps the inspector legible with many properties visible at once.

## Theming

- Dark is the default (`data-theme="dark"` / unset). Light is a first-class
  alternative (`data-theme="light"`). The attribute is set on the editor root and
  cascades via CSS variables; no component hardcodes a color.
- Theme choice persists per user.

## Keyboard & focus

- Every interactive control is reachable by Tab and shows a visible focus ring
  (`--st-ring`). Focus is never removed without a replacement indicator.
- Escape closes the top-most transient layer (popover → menu → modal), one layer
  per press.
- Segmented controls and tabs: arrow keys move between options (roving tabindex —
  to be added with full keyboard support in the editor shell phase).
- Modals trap focus while open and restore focus to the trigger on close
  (focus-trap to be layered in when the shell mounts modals in real flows).

## ARIA roles (as implemented in the kit)

- Segmented / tabs: `role="tablist"` containing `role="tab"` with `aria-selected`.
- Tree rows: `role="treeitem"` with `aria-selected` and, when expandable,
  `aria-expanded`; **must** be rendered inside a `role="tree"` container.
- Toolbar: `role="toolbar"` with an `aria-label`.
- Modal: `role="dialog"` + `aria-modal="true"` + label.
- Context menu: `role="menu"` containing `role="menuitem"`.
- Tooltip: `role="tooltip"`, shown on hover and keyboard focus.
- Icon-only buttons carry an `aria-label`.

## States

Every data-bearing surface defines four states, built from the kit:

- **Empty** — an invitation with a primary action ("No pages yet — create one").
- **Loading** — a non-blocking indicator; never a layout jump.
- **Error** — what happened + how to recover, using the `danger` role tokens.
- **Populated** — the normal case.

## Motion

Transitions use `--st-dur-fast` (120ms) for hovers/toggles and `--st-dur-base`
(180ms) for panel/overlay transitions, with `--st-ease`. Motion is informative,
never decorative; respect `prefers-reduced-motion` (to be wired in the shell).

## Content voice

Sentence case everywhere. Verb-first buttons ("Publish", "Create page"). No
exclamation marks in system copy. Errors say what to do next.
