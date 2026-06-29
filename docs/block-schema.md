# Block Schema (v1)

The block tree is the **single source of truth** during editing. It is plain JSON, persisted per page, and compiled to Blade at publish time. This document is the canonical contract — the inspector, AI, compiler, and renderer all target it.

## A block

```jsonc
{
  "id": "blk_01H...",          // stable unique id (ULID). Never reused.
  "type": "hero",              // maps to an <x-hero /> component in the registry
  "props": {                    // component-specific structured props
    "headline": "Welcome",
    "subheadline": "Build real Laravel sites visually."
  },
  "classes": {                  // per-breakpoint Tailwind utilities (see below)
    "base": ["bg-white", "py-12"],
    "md":   ["py-20"],
    "lg":   ["py-28"]
  },
  "children": []                // nested blocks (for layout containers)
}
```

Only `id` and `type` are required. `props`, `classes`, and `children` default to empty.

## Per-breakpoint classes (the responsive model)

Tailwind is **mobile-first**, so the schema mirrors that:

- `classes.base` → emitted as-is (applies at all widths, i.e. mobile and up).
- `classes.md` → emitted with the `md:` prefix.
- `classes.lg` → emitted with the `lg:` prefix.
- (extendable: `sm`, `xl`, `2xl`, and `dark` follow the same rule.)

So editing at the **Mobile** breakpoint in the inspector writes to `base`; editing at **Tablet** writes to `md`; editing at **Desktop** writes to `lg`. The compiler flattens this into a single deterministic `class="..."` string.

### Resolution rules

1. Order is stable: `base`, then `sm`, `md`, `lg`, `xl`, `2xl`, then `dark`. This guarantees identical output every publish (no diff noise).
2. Within a breakpoint, classes are emitted in the order stored (the inspector keeps them grouped by property).
3. An empty breakpoint map emits nothing.
4. "Reset to inherit" in the inspector simply removes the key from the override map — the property falls back to `base`.

## A page

```jsonc
{
  "title": "Home",
  "slug": "home",                 // → route + resources/views/pages/home.blade.php
  "blocks": [ /* ordered Block[] */ ]
}
```

Block order in the array is render/source order. Publishing compiles `blocks` into a Blade file; the JSON is retained as the editable source.

## Invariants (enforced by validation + tests)

- Every `id` is unique within a page.
- Every `type` exists in the component registry.
- `classes` keys are a subset of the allowed breakpoints (`base|sm|md|lg|xl|2xl|dark`).
- Compilation is **deterministic**: same JSON in → byte-identical Blade out.
- Compilation is **idempotent at publish**: re-publishing an unchanged page yields a zero git diff.
