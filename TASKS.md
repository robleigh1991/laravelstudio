# Laravel Studio — Task Tracker

Living checklist for the build. Check items off as they land. Each phase carries its own testing tasks — a phase is **not done until its tests are green**. See `ROADMAP.md` for the full rationale, dependencies, and risks.

**Legend:** `[ ]` todo · `[~]` in progress · `[x]` done · 🧪 = testing task · ⚠️ = high-risk / needs senior attention

---

## Progress dashboard

| Phase | Title | Status | Tests green? |
|---|---|---|---|
| 0 | Foundations & spike | ✅ DONE — CI green on main | ✅ CI green (Backend + Frontend) |
| 1 | Design system & admin UI | 🔄 Tokens + core kit + gallery done | ⏳ run locally |
| 2 | Editor shell & explorer | ☐ Not started | — |
| 3 | Component library & block rendering | ☐ Not started | — |
| 4 | Visual editing, inspector & responsive | ☐ Not started | — |
| 5 | Drag & drop + theme system | ☐ Not started | — |
| 6 | Publish: Blade compilation & Git | ☐ Not started | — |
| 7 | AI assistant | ☐ Not started | — |
| 8 | Assets & media library | ☐ Not started | — |
| 9 | App features: forms, auth, blog | ☐ Not started | — |
| 10 | Deployment & polish | ☐ Not started | — |
| 11+ | Future / post-1.0 | ☐ Backlog | — |

Update the status emoji (☐ → 🔄 → ✅) as phases move.

---

## Phase 0 — Foundations & spike

- [x] Stand up Laravel app shell (Laravel **13.8**, PHP 8.3, Vite 8, Tailwind 4) — installed
- [x] ⚠️ Define the block schema (`id`, `type`, `props`, `classes`, `children`) — single source of truth → `docs/block-schema.md`
- [x] Design schema to hold per-breakpoint overrides (base + `md`/`lg` maps) from day one → `ClassMap` (TS) + `Block` (PHP)
- [x] PHP DTOs: `app/Studio/Blocks/Block.php`, `ClassResolver.php`; TS types: `resources/js/studio/types/block.ts`
- [x] ⚠️ Spike: 3 components (hero/features/footer) → JSON → compiled Blade via `php artisan studio:compile home`
- [x] Responsive-by-default Blade components: `resources/views/components/{hero,features,footer}.blade.php`
- [x] JSON→Blade compiler: `app/Studio/Compiler/BladeCompiler.php` (deterministic, alphabetical props, mobile-first classes)
- [x] Verified transformation logic + determinism via Node prototype before porting to PHP
- [x] 🧪 Unit tests: `ClassResolverTest`, `BladeCompilerTest` (determinism, ordering, escaping)
- [x] 🧪 Feature test: `CompilePageCommandTest` — compiles sample page + idempotency (zero-diff re-publish)
- [x] Write ADR: one-way compile + JSON-as-source-of-truth → `docs/adr/0001-...md` (incl. CRDT note)
- [x] Frontend tooling: Vue 3, Pinia, Vue Router, VueUse, Vitest + `@vue/test-utils` (`package.json`, `vite.config.js`)
- [x] TS mirror of the class resolver + Vitest tests; Vue smoke component + test
- [x] Static analysis: Larastan (`phpstan.neon`), Pint (`pint.json`), ESLint flat config (`eslint.config.js`), Prettier, `tsconfig.json`
- [x] CI workflow gating PRs on Pint + PHPStan + Pest + ESLint + typecheck + Vitest → `.github/workflows/ci.yml`
- [x] Install deps + run suites locally: Pest **16/16**, Vitest **7/7**, Pint clean, PHPStan clean, ESLint 0, tsc clean
- [x] ✅ Pushed to private GitHub repo (`laravel-studio`); CI workflow green on `main` (Backend + Frontend)
- [x] CI hardening: `.env` + `APP_KEY` generation for backend; dedicated `vitest.config.ts` isolated from the Laravel Vite plugin

**Exit:** A prop change in JSON produces a predictable, git-friendly Blade diff. ADR written. CI green. ✅ **MET — Phase 0 complete.**

---

## Phase 1 — Design system & admin UI foundation

- [x] Define design tokens: color, type scale, spacing, radius, elevation, motion → `resources/css/studio-tokens.css`
- [x] Light + dark admin themes (dark-first; `[data-theme="light"]` override)
- [x] High-fidelity mockup of the three-pane editor — **signed off** (dark pro-tool, indigo accent)
- [~] Build Vue component kit (`resources/js/studio/ui/`): **done:** Button, TextInput, Segmented, Panel, Select, Slider, Tabs, Tooltip
  - [ ] remaining: color picker, popover (Floating UI), modal, context menu, toolbar, tree row
- [x] Storybook-style gallery of the kit with light/dark toggle → `/studio/gallery` (`resources/js/studio/gallery/`)
- [x] 🧪 Component unit tests for the built components (Button, TextInput, Segmented)
- [ ] Interaction & layout spec: panel docking/resize, shortcuts, focus, empty/loading/error states, density
- [ ] Accessibility baseline pass across the full kit: keyboard nav, focus mgmt, contrast, ARIA
- [ ] 🧪 axe accessibility checks on the kit gallery in CI
- [ ] 🧪 Visual-regression baseline snapshots of the kit (light + dark)
- [ ] ▶️ Verify locally: `npm run lint` · `npm run typecheck` · `npm test`; view kit at `/studio/gallery`

**Exit:** Approved editor mockup + kit gallery. Every later panel is built from this kit. Tests green.
**Status:** First increment (tokens + 4 core components + gallery + tests) built. More kit components, the interaction/a11y spec, and visual-regression remain before Phase 1 closes.

---

## Phase 2 — Editor shell & explorer

- [ ] Three-pane layout (Explorer · Preview · Inspector/AI), resizable, built from Phase 1 kit
- [ ] Explorer: file tree over `resources/views`, routes, assets (read real filesystem)
- [ ] Explorer actions: rename, duplicate, delete, search
- [ ] ⚠️ Monaco integration: Blade, PHP, HTML, CSS, JS, TS, Vue, JSON, MD, YAML
- [ ] Custom Blade grammar for Monaco (start from community grammars)
- [ ] Monaco features: highlight, folding, find/replace, command palette
- [ ] Project model: create/open/list projects (each = real Laravel dir on disk)
- [ ] 🧪 Feature tests: project create/open, file read/write to disk
- [ ] 🧪 Component tests: explorer tree, Monaco panel wiring
- [ ] 🧪 E2E: open project → browse → edit a file in Monaco → save → verify on disk

**Exit:** Open a project, browse files, edit any file in Monaco, save to disk. Tests green.

---

## Phase 3 — Component library & block rendering

- [ ] Build 10–15 Blade components as `<x-...>` with typed, documented props (hero, header, footer, features, pricing, FAQ, CTA, cards, testimonials, navigation)
- [ ] Responsive-by-default behavior baked into every component (fluid type, stacking grids, mobile nav)
- [ ] Block→preview renderer (server-rendered Blade)
- [ ] Page model: ordered list of blocks, persisted as JSON during editing
- [ ] Component registry: metadata describing each component's editable props
- [ ] 🧪 Unit tests: registry logic, block schema validation, component prop contracts
- [ ] 🧪 Render tests: each component renders correctly from JSON
- [ ] 🧪 Responsive snapshot test: each component at desktop/tablet/mobile
- [ ] 🧪 E2E: compose a page from blocks → renders correctly in preview

**Exit:** Compose a page from blocks in JSON and see it render correctly. Tests green.

---

## Phase 4 — Visual editing, inspector & responsive control

- [ ] Click-to-select on canvas → highlight → maps to block/element
- [ ] Inspector sections: General, Layout, Spacing, Typography, Appearance, Responsive, Animations, A11y, SEO
- [ ] ⚠️ Curated Tailwind token/class abstraction layer (the model behind every control)
- [ ] ⚠️ Per-breakpoint switcher (Desktop/Tablet/Mobile): resizes canvas + scopes edits to breakpoint
- [ ] Mobile-first generation: base utilities at Mobile, `md:`/`lg:` overrides at Tablet/Desktop
- [ ] Inspector shows overridden-per-breakpoint props + reset-to-inherit
- [ ] Live preview updates on edit at the selected breakpoint width
- [ ] Layers panel (Figma tree): reorder, duplicate, hide, lock
- [ ] 🧪 Unit tests: ⚠️ per-breakpoint override resolution (base + overrides → correct classes)
- [ ] 🧪 Component tests: inspector controls write expected Tailwind classes
- [ ] 🧪 E2E: select hero → edit copy/color/padding → switch to Mobile → stack/shrink for mobile only → reorder → verify each breakpoint live
- [ ] 🧪 Visual regression: edited page at desktop/tablet/mobile

**Exit:** Non-dev edits a hero, makes mobile-only changes, reorders sections, sees each breakpoint update live. Tests green.

---

## Phase 5 — Drag & drop + theme system

- [ ] Drag & drop (SortableJS): sections, columns, rows, cards, buttons, nested layouts
- [ ] Insert from component palette
- [ ] Theme system: primary/secondary color, typography, radius, container width, spacing, logo, dark mode (CSS vars / Tailwind tokens)
- [ ] Responsive container/breakpoint defaults configurable at theme level
- [ ] 🧪 Unit tests: theme token → CSS variable / class mapping
- [ ] 🧪 E2E: drag a section in, drop between others, change theme primary → whole site updates
- [ ] 🧪 Visual regression: theme change applied site-wide

**Exit:** Drag/drop works; theme change restyles the whole site. Tests green.

---

## Phase 6 — Publish: Blade compilation & Git ⚠️ (core promise)

- [ ] ⚠️ JSON→Blade compiler: clean `resources/views/pages/*.blade.php` with `<x-...>` tags
- [ ] Deterministic, formatted, git-friendly output (re-publish = zero diff)
- [ ] Routing generation: pages → Laravel routes
- [ ] Integrated Git: commit, history, branches, diff viewer, rollback
- [ ] Round-trip guard: published project boots + renders identically to editor, at every breakpoint
- [ ] 🧪 ⚠️ Compiler unit tests across a page corpus (correctness + determinism)
- [ ] 🧪 ⚠️ Round-trip tests: JSON → Blade → HTML identical across breakpoints, on every commit
- [ ] 🧪 Feature tests: publish pipeline + route generation
- [ ] 🧪 E2E: Publish → generated project runs with `php artisan serve` → matches editor at all widths

**Exit:** Published Laravel project opens in VS Code, runs standalone, matches editor at desktop/tablet/mobile. No Studio runtime required. Tests green.

---

## Phase 7 — AI assistant

- [ ] AI panel reads block tree, component registry, theme as context
- [ ] Scoped actions: change copy, convert to dark mode, generate FAQ block, "make this responsive"
- [ ] Generative: create a pricing page, convert HTML→Blade, make reusable component
- [ ] ⚠️ Guardrails: AI edits block/JSON model or emits registry components — not freeform file writes
- [ ] 🧪 Tests: AI output validates against the block schema / registry (rejects invalid)
- [ ] 🧪 Test: "make this responsive" produces correct per-breakpoint overrides
- [ ] 🧪 E2E: AI generates a multi-block page that compiles cleanly

**Exit:** AI reliably performs scoped edits and generates pages that compile. Tests green.

---

## Phase 8 — Assets & media library

- [ ] Upload, search, folders, alt text, lazy loading
- [ ] Image optimization/resize/compress pipeline (queue-backed)
- [ ] SVG / icon / font handling
- [ ] Responsive images in output: `srcset`/sizes + lazy loading
- [ ] 🧪 Feature tests: upload, optimization pipeline, queue jobs
- [ ] 🧪 Test: generated output includes correct `srcset`/lazy loading

**Exit:** Media managed + optimized; output ships responsive images. Tests green.

---

## Phase 9 — App features: forms, auth, blog

- [ ] Forms: visual builder → contact/newsletter with validation, email, DB storage
- [ ] Auth scaffolding: login, register, password reset, email verification, 2FA, dashboard, roles/permissions (Fortify/starter kits)
- [ ] Blog: categories, tags, authors, featured images, rich text, drafts/publishing, SEO
- [ ] 🧪 Feature tests: form submission → validation → email → DB record
- [ ] 🧪 Feature tests: auth flows (login/register/reset/2FA)
- [ ] 🧪 Feature tests: blog CRUD + publishing
- [ ] 🧪 E2E: generate a contact form + blog as standard Laravel code

**Exit:** Working contact form + blog generated as standard Laravel. Tests green.

---

## Phase 10 — Deployment & polish

- [ ] Deploy targets: GitHub/GitLab push → Forge/Ploi → 20i/DigitalOcean/Docker
- [ ] Onboarding + templates/starter projects
- [ ] Performance passes + docs
- [ ] Final UI polish + a11y audit (confirmation pass vs. Phase 1 design system)
- [ ] 🧪 Cross-device QA of generated output on real phones/tablets
- [ ] 🧪 Full E2E suite green on the main user journeys
- [ ] 🧪 Visual-regression suite green (editor + output, all breakpoints)
- [ ] 🧪 Deployment smoke tests per target

**Exit:** One-click ship works; editor is polished and accessible; output verified on real devices. Tests green.

---

## Phase 11+ — Future / post-1.0 (backlog)

- [ ] E-commerce (products, cart, checkout, payments, orders, coupons, shipping, tax)
- [ ] Multi-site / white-label
- [ ] Marketplaces (theme / component / template)
- [ ] Plugin system
- [ ] Live collaboration + comments + approval workflows ⚠️ (needs CRDT-friendly schema from Phase 0)
- [ ] Multi-language / CMS collections
- [ ] REST / GraphQL API
- [ ] CLI / desktop app

---

## Standing quality bar (every phase)

- [ ] Unit + feature tests written alongside the feature (not after)
- [ ] Compiler round-trip + a11y checks pass on every PR
- [ ] E2E + visual regression pass before merge to main
- [ ] New UI built from the Phase 1 design-system kit (no drift)
- [ ] Responsive behavior verified at desktop/tablet/mobile
