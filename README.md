# Stickora Studio

A browser-based sticker design engine built as a real creative tool—not a static UI concept. Stickora combines responsive canvas interactions, artwork import, editable typography, die-cut preparation, material configuration, pricing, and export workflows.

## Product highlights

- Fabric.js canvas with selection, transform, layering, mirroring, and history controls
- Image upload and live artwork manipulation
- Straight and curved editable text
- Die-cut contour workflow and production-oriented preview
- Material, laminate, dimension, and quantity configuration
- Resilient configuration loading with local fallback data
- Responsive editor shell and portfolio-quality product landing page
- Static-safe architecture for reliable GitHub Pages deployment

## Architecture

- **Next.js 14 App Router** for routing, metadata, and static delivery
- **TypeScript** for component and service contracts
- **Fabric.js** isolated behind a client-only workspace boundary
- **Redux Toolkit** for shared editor state
- **Tailwind CSS + scoped product CSS** for editor utilities and the marketing surface

The Fabric.js workspace is dynamically loaded on the client. This prevents browser canvas dependencies from leaking into server-side prerendering, while a typed data service uses a bounded request and complete fallback configuration to keep the editor usable when the external catalogue API is unavailable.

## Run locally

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000`, then launch the studio at `/editor`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

Pushes to `main` build a static production artifact and deploy it with GitHub Actions to GitHub Pages.

## Author

Designed and engineered by [Md. Tanjir Mahabub](https://github.com/tanjir-mahabub).
