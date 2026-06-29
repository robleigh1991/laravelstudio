# Project guidance for Claude — Laravel Studio

## Working rules

- **Always verify latest versions and cross-package compatibility before specifying any dependency version.** Do not guess or invent version numbers. Check the registry (`npm view <pkg> version peerDependencies`, `composer show -a <pkg>`) and confirm peer-dependency ranges line up with what's already installed (e.g. Vite major ↔ plugin/Vitest support) *before* writing them into `package.json` / `composer.json`. A dry run (`npm install --dry-run`) is the proof.
  - Lesson from Phase 0: shipped `@vitejs/plugin-vue@^5` + `vitest@^3` against Vite 8 → ERESOLVE. Correct was plugin-vue v6 + Vitest v4. Don't repeat — check first.

## Project facts

- Stack: Laravel 13.8, PHP 8.3, Vite 8, Tailwind 4, Vue 3.5, Pinia, Vue Router, Pest 4, Vitest 4.
- Architecture: JSON block tree is source of truth; one-way deterministic compile to Blade (see `docs/adr/0001-...md`, `docs/block-schema.md`).
- Plan lives in `ROADMAP.md`; task tracking in `TASKS.md`. **Work phase by phase — do not start a phase until the prior phase's exit criteria (incl. green CI) are met.**
