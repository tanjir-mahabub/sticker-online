# Sticker Online

A full-stack, browser-based sticker design engine built with Next.js, TypeScript, Fabric.js, Redux Toolkit, and versioned serverless APIs. The product combines real canvas editing, resilient catalogue delivery, live production configuration, pricing, and print-oriented export.

## Product capabilities

- Fabric.js canvas selection, scaling, rotation, layering, mirroring, zoom, and history
- Image upload with drag-and-drop and client-side file constraints
- Straight and curved editable typography
- Die-cut contour generation and border controls
- Eight material finishes, three laminates, six quantity tiers, and dimension pricing
- Responsive desktop/mobile editor controls
- SVG/PDF-oriented production export workflow
- Same-origin catalogue and quote APIs with validated offline-safe defaults

## API

### `GET /api/v1/sticker-data`

Returns the typed material catalogue, laminate options, quantity tiers, and pricing configuration. Responses are CDN-cacheable and versioned with `X-API-Version`.

### `POST /api/v1/quote`

Creates a deterministic SEK quote from production selections.

```json
{
  "widthCm": 10,
  "heightCm": 8,
  "materialId": 1,
  "laminateId": 1,
  "quantityId": 3
}
```

### `GET /api/health`

Provides a lightweight deployment health signal.

## Resilience model

The editor uses its own versioned API instead of the discontinued external service. The catalogue is also shared as a typed local domain module. A bounded request, response-shape validation, and complete fallback data ensure that a temporary API failure never prevents the canvas from loading.

## Architecture

- Next.js 14 App Router for UI and serverless route handlers
- Fabric.js isolated behind a client-only editor boundary
- Redux Toolkit for editor and production configuration state
- Shared TypeScript contracts between catalogue, API, and UI
- Vercel deployment for dynamic API routes and edge caching
- GitHub Actions quality gates for type checking and production builds

## Local development

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000` and launch `/editor`.

## Quality gates

```bash
npm run typecheck
npm run build
```

## Author

Designed and engineered by [Md. Tanjir Mahabub](https://github.com/tanjir-mahabub).
