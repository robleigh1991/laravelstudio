# ADR 0001 — JSON block tree as source of truth, one-way compile to Blade

- **Status:** Accepted
- **Date:** 2026-06-29
- **Phase:** 0 (Foundations & spike)

## Context

Laravel Studio edits websites visually but promises real, portable Laravel
output with no proprietary format. Two representations are unavoidable:

1. A **block tree** (JSON) — convenient for visual editing, the inspector, drag
   & drop, AI, and the layers panel.
2. **Blade** — the real, shippable artifact developers open in VS Code.

The central architectural question is how these two relate. Three options:

- **A. Blade as source of truth (parse-on-edit).** Edit visually, parse Blade
  back into an editable model on every load. Requires a full, lossy-free Blade
  parser that round-trips arbitrary developer-written Blade. This is a
  research-grade problem and breaks the moment a developer writes Blade the
  parser doesn't understand.
- **B. Bidirectional sync.** Keep JSON and Blade in sync both directions.
  Combines the hardest parts of A with conflict-resolution complexity.
- **C. JSON as source of truth, one-way compile to Blade at publish.** The block
  tree is canonical during editing; publishing deterministically generates
  Blade. (Chosen.)

## Decision

Adopt **Option C**: the JSON block tree is the single source of truth during
editing. Publishing performs a **one-way, deterministic compile** to Blade.

- The compiler (`App\Studio\Compiler\BladeCompiler`) emits `<x-...>` component
  tags with stable, alphabetical prop ordering and mobile-first class flattening
  (`App\Studio\Blocks\ClassResolver`).
- Output is **deterministic** (same JSON → byte-identical Blade) and
  **idempotent at publish** (re-publishing an unchanged page = zero git diff).
- Generated Blade depends only on standard Laravel + the project's own
  components — no Studio runtime. The output is fully portable.

## Consequences

**Positive**

- Sidesteps the research-grade Blade-parsing problem entirely.
- Deterministic output makes Git diffs meaningful and review-friendly.
- The visual editor, inspector, and AI all target one well-specified contract
  (`docs/block-schema.md`).

**Negative / trade-offs**

- Hand-edits a developer makes directly in compiled `pages/*.blade.php` are **not
  re-imported** into the block tree. Mitigation: compiled page files are
  treated as build output; developer-authored Blade lives in components and
  layouts, which the compiler references but never overwrites. This boundary
  must be communicated clearly in the UI.
- Editing is constrained to what the block schema can express. The schema must
  evolve deliberately (versioned).

## Notes

- **Collaboration (future):** if real-time multiplayer editing is pursued, the
  block tree must be modelled CRDT-friendly (stable per-node `id`s — already in
  the schema; consider per-field maps). Decide before building collab, not after.
- **Schema versioning:** the schema is v1. Add a top-level `version` field
  before the first breaking change so old pages can be migrated.

## Revisit if

- A reliable, loss-free Blade↔model round-trip becomes feasible and users demand
  editing arbitrary hand-written Blade visually.
