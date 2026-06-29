# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Demo: legacy travel blog on GitHub Pages (`/docs`)

The `/docs` folder is a **standalone, retro (circa 2002–2004) travel blog** —
"Katie's Travel Journal" — used as the "before" artifact in a migration demo
(an old hand-coded site we later migrate *into* AEM Edge Delivery Services). It
is plain HTML/CSS with **no Adobe/EDS code**, is excluded from EDS code-sync via
`.hlxignore`, and is published separately to GitHub Pages.

To publish it after merging to `main`:
1. Go to **Settings → Pages → Build and deployment**, set **Source: "Deploy from
   a branch"**, then pick branch **`main`** and folder **`/docs`** and Save.
   (GitHub's branch deploy only allows the repo root or `/docs` — hence `/docs`.
   No custom workflow is needed; GitHub auto-generates its own
   `pages-build-deployment` run.)
2. The site publishes to `https://{owner}.github.io/{repo}/` (for this repo,
   <https://jackzhaojin.github.io/adapt-to-2026-demo/>).

## Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
