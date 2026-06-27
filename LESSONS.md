# Lessons Learned

A living log of non-obvious, hard-won lessons building this AEM Edge Delivery Services
site. Add entries as you hit (and solve) things worth remembering. Keep each entry
**actionable**: what happened, why, and what to do. Newest section at the bottom of each list.

> Mirrored for AI agents in `.claude` project memory. This file is the human-facing,
> committed copy. `*.md` is in `.hlxignore`, so this is never served as a page.

---

## Theming & page metadata

- **Theme metadata keys MUST be lowercase.** `getMetadata('theme')` does a
  case-sensitive `meta[name="theme"]` lookup. The DA/Helix pipeline emits the
  Metadata-block key verbatim, so a row keyed `Theme` (capital) becomes
  `<meta name="Theme">` and never matches → the `<body>` theme class is silently
  never added. Always key the row lowercase `theme` (and `template`). No error is
  thrown — it just doesn't apply.

- **Theme the page by re-pointing CSS variables, not by overriding rules.** Each
  theme (`body.white`, `body.forest`, …) only redefines color custom properties
  (`--background-color`, `--text-color`, `--heading-color`, `--link-color`,
  `--button-primary-*`). Headings/body/links/buttons then re-theme automatically and
  the header/footer come along for free. This also sidesteps stylelint's
  `no-descending-specificity` rule (which fires if you add higher-specificity theme
  override selectors before the base rules).

- **`decorateTemplateAndTheme()` is the page-level hook and it already exists.** Page
  metadata `theme`/`template` → `<body>` class. No JS changes needed for whole-page
  themes — just CSS on the body class.

- **Section-level styling does NOT work out of the box here** — see Tooling/Code below.

## DA (Document Authoring) & content

- **Match the canonical DA body format.** Documents are
  `<body><header></header><main><div>…sections…</div></main><footer></footer></body>`.
  Sections are top-level `<div>`s in `<main>`. The page Metadata block is
  `<div class="metadata">` with each row as `<div><div><p>Key</p></div><div><p>Value</p></div></div>`,
  in its own trailing section `<div>`. Copy the existing `index.html` shape exactly.

- **Buttons come from authored emphasis.** `<p><strong><a>…</a></strong></p>` →
  primary button; `<p><em><a>…</a></em></p>` → secondary. One link per paragraph, and
  it must be the only content of the `<p>`. Two links in one `<p>` → not buttonized.

- **`metadata.json` is the bulk/path-based metadata sheet** (`URL: /**` → key/value).
  Use it to set defaults by path pattern; use per-page Metadata blocks for one-offs.

- **Local `--html-folder` rendering matches DA exactly.** A draft validated locally
  (typography, themes, buttons, computed styles) renders identically once authored in
  DA. Trust the local-first loop. (Verified white theme byte-for-byte on computed
  styles.)

## Local dev & validation

- **`--html-folder` maps the FULL path including the folder.** `aem up --html-folder
  drafts` serves `drafts/foo.html` at `/drafts/foo` (or `.plain.html`), NOT at `/foo`.
  Requesting the bare name just proxies to the remote and 404s.

- **Inspect deployed text assets with `curl --compressed`.** `*.aem.page` serves CSS/JS
  with brotli/gzip; plain `curl` returns binary garbage and greps yield false negatives.

- **Self-host fonts as variable woff2 with `size-adjust` fallbacks.** Google serves one
  variable woff2 per family (latin subset) covering all weights; declare a
  `font-weight` range and a `local()` fallback face for CLS.

## Deployment & branches

- **Content bus is shared across branches; code is per-branch.** A DA-previewed page
  shows on *every* `{branch}--{repo}--{owner}.aem.page`, but CSS/JS comes from that
  branch's git. So themed pages render correctly only on a branch that has the theme
  code, and "light up" on `main` only after the code PR merges.

- **Branch names are length-limited.** `{branch}--{repo}--{owner}.aem.page` must stay
  ≤63 chars per DNS label or `aem up` refuses to start
  ("exceeds the 63 character limit"). Keep feature branches short
  (e.g. `wilderness-baseline`, not `baseline/wilderness-path-typography`).

## Tooling & code

- **`npm run lint:js` is broken (pre-existing).** `eslint@8.57.1` conflicts with
  `@babel/eslint-parser@8` (needs eslint 9/10) → `npm install` ERESOLVE without
  `--legacy-peer-deps`; `@babel/core` is missing; and eslint 8.57's `indent` rule
  stack-overflows on `scripts/aem.js`. So `npm run lint` fails before CSS. Lint CSS
  directly: `npx stylelint "styles/**/*.css" "blocks/**/*.css"`. A real fix means
  bumping eslint + aligning the babel parser in `package.json`.

- **This repo's `scripts/aem.js` is a stripped variant.** Its `decorateSections` only
  wraps content + adds `.section`; it does NOT read `.section-metadata` or apply a
  `Style` class (the upstream boilerplate does). Per-section background bands need a
  small `decorateSectionStyles(main)` helper in `scripts.js` (read the block with
  `readBlockConfig`, apply `toClassName(style)` to the section, remove the block before
  `decorateBlocks`). Never edit `aem.js` (per AGENTS.md).

## Process / what worked

- **Content-first (CDD) with a local draft is the right loop:** pull the design →
  define tokens → build a local `drafts/` page exercising every element → iterate CSS
  with playwright across viewports → only then author real DA content. The local draft
  proved a faithful proxy for DA.

- **Validate with computed styles, not just screenshots.** `playwright-cli eval` of
  `getComputedStyle` caught a false "link color wrong" (it was a header nav link, not
  body content) and confirmed each theme's exact hex values.
