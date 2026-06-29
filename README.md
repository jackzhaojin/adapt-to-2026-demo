# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Demo: legacy travel blog on GitHub Pages (`/ghp`)

The `/ghp` folder is a **standalone, retro (circa 2002–2004) travel blog** —
"Katie's Travel Journal" — used as the "before" artifact in a migration demo
(an old hand-coded site we later migrate *into* AEM Edge Delivery Services). It
is plain HTML/CSS with **no Adobe/EDS code**, is excluded from EDS code-sync via
`.hlxignore`, and is published separately to GitHub Pages.

To publish it after merging to `main`:
1. Go to **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
   (A custom folder name like `/ghp` can't use "Deploy from a branch", which only
   allows the repo root or `/docs`; the `.github/workflows/deploy-pages.yml`
   workflow uploads `/ghp` instead.)
2. Push/merge to `main` — the workflow deploys the site and prints its URL
   (typically `https://{owner}.github.io/{repo}/`).

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
