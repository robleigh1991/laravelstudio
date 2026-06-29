# Laravel Studio — Implementation Roadmap

A phased plan to take Laravel Studio from empty repo to shipping product. Built from the vision spec, sequenced so each phase delivers something usable and de-risks the next. Estimates assume a small senior team (2–4 engineers) and are directional, not commitments.

---

## Guiding sequencing logic

The hardest, most differentiating problem is the **round-trip between visual edits and real Laravel code** — JSON blocks compiling to clean Blade, and selections mapping back to source. Everything else (AI, deployment, e-commerce) is valuable but bolts onto that core. So the roadmap front-loads the code-generation engine and the editor shell, proves the visual↔code loop end-to-end on a thin slice, then widens.

A second principle: **build the editor as a Laravel Studio project itself as early as possible** (dogfood). The moment the component library and compiler exist, the team should feel the pain points users will feel.

A third principle: **the admin/editor UI is a product surface, not scaffolding.** A tool that competes with Figma and Webflow is judged on how its own interface looks and feels. Design quality is therefore a dedicated phase up front *and* a standing quality bar every phase is held to — not a cleanup pass at the end.

---

## Phase 0 — Foundations & spike (≈3–4 weeks)

**Goal:** Prove the riskiest assumption — that a JSON block tree can compile to clean, idempotent Blade and round-trip back — before committing to the full architecture.

- Stand up the Laravel app shell (Laravel 12/13, PHP 8.3+, Vite, Vue 3, Tailwind 4, Pinia, Vue Router).
- Define the **block schema** (`type`, `props`, `children`, `id`, slots) as the single source of truth.
- Build a throwaway spike: 3 hardcoded components (hero, features, footer) → JSON → compiled `home.blade.php` → rendered page. Edit a prop in JSON, recompile, confirm clean diff.
- Decide the **compiler direction**: JSON→Blade one-way at publish (per spec) vs. bidirectional. Recommend one-way compile + JSON-as-source-of-truth during editing to avoid the hardest parsing problem early.
- Set up CI, coding standards (Pint, ESLint, Prettier, PHPStan), and the monorepo/app structure.

**Exit criteria:** A prop change in JSON produces a predictable, git-friendly Blade diff. Architecture decision record (ADR) written.

**Key risk:** Bidirectional code sync is a research-grade problem. Resolve scope here, not later.

---

## Phase 1 — Design system & admin UI foundation (≈3–4 weeks)

**Goal:** Make the editor itself look and feel like a premium tool from day one, and give every later phase a component kit to build on so the UI doesn't drift.

- **Admin design system**: tokens (color, type scale, spacing, radius, elevation, motion), light/dark themes, and a documented Vue component kit — buttons, inputs, selects, sliders, color pickers, tabs, popovers (Floating UI), tooltips, modals, context menus, panels, toolbars, tree rows. This is the toolkit Explorer/Inspector/Layers/AI panels are all assembled from.
- **Interaction & layout spec**: panel docking/resizing behavior, keyboard shortcuts, focus states, empty/loading/error states, density. Define these once so 10 phases of panels stay consistent.
- **Visual reference**: high-fidelity mockups of the three-pane editor (and the inspector's sub-sections) signed off before heavy build — cheaper to iterate in design than in code.
- **Accessibility baseline** for the admin UI: keyboard navigation, focus management, contrast, ARIA on custom controls — built into the kit, not retrofitted.

**Exit criteria:** A Storybook-style gallery of the admin component kit in light and dark, plus an approved editor mockup. Every subsequent panel is built from this kit.

**Why up front:** Retrofitting a design system after five panels exist means rewriting all five. A shared kit also makes Phases 2–9 faster, not slower.

---

## Phase 2 — Editor shell & explorer (≈4–6 weeks)

**Goal:** The application frame people will live in, assembled from the Phase 1 kit.

- Three-pane layout (Explorer · Live Preview · Inspector/AI) with resizable panels.
- **Explorer** behaving like VS Code: file tree over `resources/views`, routes, assets; rename, duplicate, delete, search. Read from the real filesystem, not a DB abstraction.
- **Monaco integration** as a first-class panel: Blade, PHP, HTML, CSS, JS, TS, Vue, JSON, Markdown, YAML with syntax highlighting, folding, find/replace, command palette. (Blade language support needs a custom Monaco grammar — budget for it.)
- Project model: create/open/list projects; each project is a real Laravel directory on disk.

**Exit criteria:** Open a project, browse its files, edit any file in Monaco and save to disk.

**Dependencies:** Phase 0 app shell.

---

## Phase 3 — Component library & block rendering (≈5–7 weeks)

**Goal:** The visual building blocks and the canvas that renders them.

- Build the first **10–15 Blade components** as `<x-...>` components with typed, documented props (hero, header, footer, features, pricing, FAQ, CTA, cards, testimonials, navigation). Treat each as a contract the inspector and AI will target.
- **Block→preview renderer**: render the JSON block tree to the live canvas (server-rendered Blade is simplest and most faithful since output = production).
- Page model: a page is an ordered list of blocks; persist as JSON during editing.
- Component registry: metadata describing each component's editable props (drives the inspector and AI).
- **Responsive-by-default components**: every component ships with sensible breakpoint behavior baked in (fluid type, stacking grids, mobile nav) so the generated output is responsive even before per-breakpoint tweaking exists.

**Exit criteria:** Compose a page from blocks in JSON and see it render correctly in the preview pane.

**Dependencies:** Phase 0 schema, Phase 2 shell.

---

## Phase 4 — Visual editing, inspector & responsive control (≈7–9 weeks)

**Goal:** Edit without code — the Webflow/Figma half — including true per-breakpoint editing.

- **Click-to-select** on the canvas → highlight → maps to a block/element.
- **Inspector panel**: General, Layout, Spacing, Typography, Appearance, Responsive, Animations, A11y, SEO sections. Controls write Tailwind classes (and structured props where appropriate).
- **Per-breakpoint editing (first-class)**: a Desktop / Tablet / Mobile switcher in the toolbar that (a) resizes the preview canvas to the breakpoint and (b) scopes every inspector change to that breakpoint. Editing at "Mobile" writes base utilities; editing at "Tablet"/"Desktop" writes `md:`/`lg:` overrides — i.e. mobile-first Tailwind generated automatically. The inspector shows which properties are overridden per breakpoint and lets you reset an override back to inherit.
- **Tailwind-as-model**: visual controls map to Tailwind utilities with responsive (`md:`, `lg:`) and dark-mode variants. This needs a curated Tailwind token/class abstraction layer — a meaningful sub-project, and the layer the per-breakpoint system is built on.
- **Live preview updates** on edit, at the selected breakpoint width. Start with fast iframe re-render; introduce Reverb/WebSocket hot-reload only if latency demands it (avoid premature complexity).
- **Layers panel** (Figma-style tree): reorder, duplicate, hide, lock.

**Exit criteria:** A non-developer can select a hero, change heading + button color + padding, switch to Mobile and stack the layout / shrink the heading *for mobile only*, reorder sections, and see each breakpoint update live. Resizing the preview confirms the overrides apply at the right widths.

**Dependencies:** Phases 2–3. This is the product's core value; give it room — the per-breakpoint model is the reason this phase is longer than the others.

---

## Phase 5 — Drag & drop + theme system (≈4–5 weeks)

**Goal:** Compose layouts visually and theme globally.

- **Drag & drop** (SortableJS) for sections, columns, rows, cards, buttons, nested layouts; insert from a component palette.
- **Theme system**: global primary/secondary colors, typography, radius, container width, spacing, logo, dark mode — driven by CSS variables / Tailwind theme tokens so one change restyles the whole site.
- Responsive container/breakpoint defaults configurable at the theme level (e.g. container widths per breakpoint) so per-page overrides start from sane global values.

**Exit criteria:** Drag a new section in, drop it between others, change the theme primary color and watch the whole site update.

**Dependencies:** Phase 4.

---

## Phase 6 — Publish: Blade compilation & Git (≈4–6 weeks)

**Goal:** Deliver on the core promise — real, portable Laravel code.

- **JSON→Blade compiler**: page blocks compile to clean `resources/views/pages/*.blade.php` using `<x-...>` tags. Output must be deterministic, formatted, and git-friendly (re-publishing the same page yields no spurious diffs).
- **Routing generation**: pages → Laravel routes automatically.
- **Integrated Git**: commit, history, branches, diff viewer, rollback (libgit2/CLI wrapper).
- **Round-trip guard**: verify the published project boots and renders identically to the editor preview — including at every breakpoint, so the responsive behavior shown in the editor is exactly what ships.

**Exit criteria:** Click Publish → generated Laravel project opens in VS Code, runs with `php artisan serve`, and matches the editor at desktop, tablet, and mobile widths. No Laravel Studio runtime required.

**Dependencies:** Phases 3–5. This phase is what makes the product "no lock-in."

---

## Phase 7 — AI assistant (≈5–7 weeks)

**Goal:** The Cursor-style copilot, grounded in the project model.

- AI panel that reads the block tree, component registry, and theme as context.
- Scoped actions first (lower risk, higher reliability): "change this section's copy," "convert to dark mode," "generate an FAQ block," "make this responsive."
- Then generative: "create a pricing page," "convert this HTML to Blade," "turn this into a reusable component."
- **Guardrails**: AI edits the block/JSON model or emits components against the known registry — not freeform file writes — so output stays within the system's contracts and remains reviewable as diffs.

**Exit criteria:** AI reliably performs scoped edits (including "make this responsive" producing correct per-breakpoint overrides) and generates a multi-block page that compiles cleanly.

**Dependencies:** Phases 3–6 (AI needs the model, components, and compiler to be stable first). Intentionally sequenced after the visual core, not before — AI is a multiplier on a working system, not a substitute for one.

---

## Phase 8 — Assets & media library (≈3–4 weeks)

**Goal:** Manage and optimize media.

- Upload, search, folders, alt text, lazy loading.
- Image optimization/resize/compress pipeline (queue-backed); SVG/icon/font handling.
- Responsive images in output: generate `srcset`/sizes and lazy loading so the published site is performant on mobile.

**Dependencies:** Phase 2 (filesystem), can run in parallel with Phase 7.

---

## Phase 9 — App features: forms, auth, blog (≈6–8 weeks)

**Goal:** Move from "websites" to "applications."

- **Forms**: visual builder generating contact/newsletter forms with validation, email notifications, DB storage.
- **Auth scaffolding**: login, register, password reset, email verification, 2FA, dashboard, roles/permissions (lean on Laravel starter kits / Fortify rather than rebuilding).
- **Blog system**: categories, tags, authors, featured images, rich text, drafts/publishing, SEO.

**Exit criteria:** Generate a working contact form and a blog, both as standard Laravel code.

**Dependencies:** Phase 6 (compiler + routing).

---

## Phase 10 — Deployment & polish (≈4–6 weeks)

**Goal:** One-click ship + production hardening.

- Deployment targets, prioritized: GitHub/GitLab push first (universal), then Forge/Ploi, then 20i/DigitalOcean/Docker.
- Onboarding, templates/starter projects, performance passes, docs.
- **Final UI polish + accessibility audit of the editor itself** — a *confirmation* pass against the Phase 1 design system, not the first time design is considered. Includes cross-device QA of generated output (real phones/tablets, not just the preview).

**Dependencies:** Phase 6.

---

## Phase 11+ — Future / post-1.0

Sequenced by demand, not built into v1: e-commerce, multi-site, white-label, marketplaces (theme/component/template), plugin system, live collaboration + comments + approval workflows, multi-language, CMS collections, REST/GraphQL API, CLI, desktop app.

**Note on collaboration:** real-time multiplayer editing (CRDTs/OT over the block model) is a large architectural commitment. If it's a serious goal, the block schema in Phase 0 should be designed CRDT-friendly from day one, even if collab ships much later — retrofitting it is painful.

---

## Testing strategy (cross-cutting)

Testing is not a phase — it ships inside every phase. A phase isn't "done" until its tests are green. The layered approach:

- **Unit (PHP — Pest/PHPUnit):** the compiler, block schema validation, component-registry logic, Tailwind class generation, per-breakpoint override resolution. These are pure-logic and the highest-value tests — especially the JSON→Blade compiler.
- **Unit/component (JS — Vitest + Vue Test Utils):** inspector controls, the design-system kit components, the breakpoint switcher's override/inherit logic, Pinia stores.
- **Feature/integration (Pest):** project create/open, page CRUD, publish pipeline, routing generation, forms/auth/blog scaffolding produce working Laravel code.
- **Compiler round-trip tests (the critical safety net):** for a corpus of pages, assert JSON → Blade → rendered HTML is correct, deterministic (re-publish = zero diff), and **identical across breakpoints**. This guards the product's central promise and runs on every commit.
- **End-to-end (Playwright):** the real user journeys through the editor — select → edit → switch breakpoint → drag → publish. Run against the dogfood project.
- **Visual regression (Playwright snapshots / Percy-style):** screenshot the admin UI *and* the generated output at desktop/tablet/mobile widths; fail on unintended pixel changes. This is how "everything looks good" and "responsive output" stay true over time.
- **Accessibility (axe in CI):** automated a11y checks on both the editor UI and generated sites.

**Tooling baseline (set up in Phase 0):** Pest, Vitest, Playwright, PHPStan/Larastan, Pint, ESLint/Prettier, all wired into CI with coverage gates. Target: every PR runs unit + feature + round-trip + a11y; E2E + visual regression run on merge to main.

---

## Critical path

```
Phase 0 (schema + compile spike)
        │
Phase 1 (design system / admin UI)  ← standing quality bar for every later phase
        │
   Phase 2 (shell) ── Phase 3 (components) ── Phase 4 (visual + per-breakpoint) ── Phase 5 (drag/theme)
        │                                              │
        │                                       Phase 6 (publish + Git)  ← the core promise
        │                                              │
        │                              ┌───────────────┼───────────────┐
        │                          Phase 7 (AI)   Phase 9 (forms/auth/blog)  Phase 10 (deploy + UI polish)
        └── Phase 8 (assets, parallel) ┘
```

The single most important gate is **Phase 6**: until JSON reliably compiles to clean, portable, responsive Blade, the product's central claim isn't real. Phases 0 and 6 should get the most senior attention. **Phase 1's design system is a force multiplier** — it sets the UI quality bar and is the kit every later panel is built from.

---

## Top risks & where they live

| Risk | Phase | Mitigation |
|---|---|---|
| Bidirectional code↔visual sync is research-grade | 0 | Commit to one-way compile + JSON-as-source; defer true bidirectional |
| Clean, idempotent Blade output (no diff noise) | 6 | Deterministic formatter; round-trip tests in CI |
| Per-breakpoint override model gets complex/buggy | 4 | Model overrides explicitly in the block schema (base + per-breakpoint maps); test that generated `md:`/`lg:` matches the preview |
| Tailwind-as-visual-model abstraction sprawl | 4 | Curated token layer; constrain to a supported class set |
| Admin UI drifts / looks unpolished | 1 | Design system + component kit up front; UI quality is a standing bar, confirmed (not invented) in Phase 10 |
| Blade language support in Monaco | 2 | Budget for a custom grammar; start from existing community grammars |
| AI making unreviewable freeform edits | 7 | Constrain AI to the block model + component registry |
| Real-time collaboration retrofit | 11+ | Design block schema CRDT-friendly in Phase 0 if collab matters |
| Live-preview latency | 4 | Start with iframe re-render; add Reverb hot-reload only if needed |

---

## Tech-stack notes to verify

The spec lists aggressive/leading versions. Confirm against current releases before locking:

- **Laravel 13.x** — verify it's released and stable for the team's timeline; Laravel 12 may be the safe baseline.
- **PHP 8.4+** as minimum vs. 8.3 — pick one; 8.3 is the safer floor.
- **Vite 8, Tailwind 4, Vue 3.5, Monaco 0.55, Node 22 LTS** — all plausible but pin exact versions in Phase 0 and treat Tailwind 4's engine changes as a real migration cost in the theme/visual/responsive layers.

I flagged these rather than assuming — version-currency is worth a quick check at kickoff.

---

## Suggested first milestone (the "thin vertical slice")

Don't build phases as walls. The most informative early target cuts through all of them on one component:

> Select a hero on the canvas → edit its heading and background color in the inspector → switch to Mobile and stack/shrink it for mobile only → publish → the generated `home.blade.php` renders the change responsively in a standalone `php artisan serve` project.

Hitting that proves the schema, renderer, inspector, per-breakpoint model, compiler, and portability promise all at once — and surfaces the real integration pain early, while it's cheap to fix.
