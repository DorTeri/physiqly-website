# New homepage — review build (not deployed)

`review/` is never shipped. Preview: `npx http-server review/new-home -p 8791 -c-1`.
Review captures: `_review/` (390, 768, 1280, 1440, mobile menu, focus sample).

## Assets
- Product visuals are the real app screenshots from `../product-shots-2026-10/`, framed, transparent background.
- `assets/product/<name>-{1100,1600,2400}.{avif,webp}` desktop; `m0x-*-{600,900,1200}.{avif,webp}` phone crops (served only ≤760px). Every `<picture>` = AVIF → WebP, with width/height on each source (no CLS).
- Only the hero is preloaded (one preload per breakpoint); everything else is `loading="lazy"`.
- `assets/og-image.jpg` 1200×630 (the opaque hero composition), `assets/apple-touch-icon.png` 180×180.
- Physy is rendered from the app's own 3D model (`TrainMe/public/companion/companion-v1.glb`).

## Measured (local server, cache off)
| Profile | LCP | CLS | Initial transfer | After full scroll |
|---|---|---|---|---|
| 1440 @1x | 0.8 s (hero) | 0 | ~265 KB | ~530 KB |
| 1440 @2x | 0.4 s (hero) | 0.0001 | ~350 KB | ~820 KB |
| 390 @3x, slow 4G, 4× CPU | 0.9 s (hero) | 0 | ~230 KB | ~495 KB |
HTML is 69 KB uncompressed (inline icons + CSS); the host must serve it gzipped/brotli.

## Hosting (checked 2026-10-04)
- `physiqly.fit` → 308 → `www.physiqly.fit`, which is the **Next.js app** (Vercel project of `TrainMe`); its `/` is the app's own `MarketingLanding`.
- This repo deploys (GitHub → Vercel, project `physiqly-website`) to **https://physiqly-website.vercel.app** only. No custom domain resolves to it.
- So there is no production marketing domain yet. Canonical / og:url / og:image stay `REPLACE_WITH_LIVE_URL` until the owner decides.

## Book a demo form
Posts JSON to `https://www.physiqly.fit/api/demo-requests` (the same endpoint as the app's `/demo`: Turnstile, 3 per IP per hour, a stored `DemoRequest` with `source: "marketing-site"`, admin notification email). CORS: the app allowlists `https://physiqly-website.vercel.app` (`src/lib/demoRequestCors.ts`) plus `DEMO_REQUEST_ALLOWED_ORIGINS`. Turnstile site key is the app's public key (`data-sitekey`); the marketing hostname must be on that widget's hostname list in Cloudflare or the check will not render. No email address appears on the page; failures point to `physiqly.fit/demo`.

## Ship checklist
1. App first (TrainMe): deploy the `/pricing` + `/api/demo-requests` CORS change. Without it the form's cross-origin request is refused.
2. Cloudflare Turnstile: add the marketing hostname to the widget's allowed hostnames.
3. If a custom domain is chosen: attach it to the `physiqly-website` Vercel project, add it to `DEMO_REQUEST_ALLOWED_ORIGINS` in the app, and replace `REPLACE_WITH_LIVE_URL` (canonical, og:url, og:image).
4. Copy `index.html` → `physiqly/index.html` and `assets/product/`, `assets/og-image.jpg`, `assets/apple-touch-icon.png` → `physiqly/assets/`. Remove `<meta name="robots" content="noindex">`.
5. Legal/support links point straight at `https://www.physiqly.fit/{privacy,terms,refunds,support}`.
