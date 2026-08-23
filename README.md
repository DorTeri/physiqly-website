# Physiqly website

A cinematic scroll-driven landing page for Physiqly, aimed at personal trainers. Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no npm.

## Layout

```
physiqly/            <- the deploy folder. Zip its CONTENTS, not the folder.
  index.html
  privacy/index.html   legal, ported from the app's own copy
  terms/index.html     legal, ported from the app's own copy
  refunds/index.html   legal, ported from the app's own copy
  support/index.html   contact and the four questions people actually ask
  assets/
    hero-scrub.mp4   scroll-scrubbed hero, 6s, 1080p, keyframe every 8 frames
    hero-poster.jpg  first frame, painted before the video streams in
    hero-ending.jpg  last frame, reused as the static hero and CTA background
    pages.css        the four subpages; index.html stays self-contained
    logo-full.webp
    logo-mark.webp
    shots/           nine real app screenshots, captured from demo accounts
review/              design package and inspection files. Never deployed.
```

## How the hero works

The hero is a 600vh pinned region containing a sticky full-viewport stage. Scroll progress through it maps 0 to 1 and drives the video's `currentTime`, so scrolling down plays the film forward and scrolling up plays it backward. The video is fetched as a Blob behind a progress ring, because many hosts lack HTTP Range support and seeking silently breaks without it.

Five conditions serve a composed static image hero instead of the scrub: phones, portrait tablets, coarse-pointer portrait, landscape phones, and reduced motion. Those five media queries are written identically in the CSS and in the JavaScript, and they are re-evaluated live on rotation, resize and preference changes. Visitors on the static path never download the video or the poster.

## The subpages

`/privacy`, `/terms`, `/refunds` and `/support` are plain documents sharing
`assets/pages.css`, which repeats index.html's tokens, nav, buttons and footer
verbatim and adds a prose layer on top. They carry no JavaScript. Each is a
folder with an `index.html` so the URL is `/privacy`, not `/privacy.html`.

The copy is ported from the app (`Desktop/TrainMe`), word for word:
`src/app/{privacy,terms,refunds,support}/page.tsx`. A policy change therefore
has two homes — change it in the app and here.

Pricing is deliberately **not** a page. The tier ladder is section 09 of
index.html (`#pricing`), between the FAQ and the demo form, so the prices sit at
the end of the scroll rather than behind a click. Its copy comes from the app's
`src/app/pricing/page.tsx` and the `pricing.*` strings in
`src/lib/i18n/translations.ts`; the five prices and client caps come from
`src/lib/planTiers.ts` and are hardcoded here, so keep them in step.

Only the English copy was ported. The app's pricing page is bilingual; this site
is not, because it has no language switcher.

## Editing

Open `physiqly/index.html`. Everything is in that one file: tokens at the top of the `<style>` block, then sections in page order, then the script.

To preview the full scroll experience you need a local server, because browsers block `fetch` on `file://` URLs:

```bash
npx http-server physiqly -p 8080 -c-1
```

Double-clicking `index.html` shows the static-image hero instead. That is the designed fallback, not a bug.

## Screenshots

Captured from the app's demo accounts (`guy.egozin@trainme.app` and `tom.levi@trainme.app`), never from real client data. Recapture with the app running on `localhost:3000`.

## Deploy

Zip the CONTENTS of `physiqly/` so `index.html` sits at the zip's top level, then deploy as a static site. Patch the `<!-- DEPLOY STEP -->` og tags with the live URL first.
