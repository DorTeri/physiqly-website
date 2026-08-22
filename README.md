# Physiqly website

A cinematic scroll-driven landing page for Physiqly, aimed at personal trainers. Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no npm.

## Layout

```
physiqly/            <- the deploy folder. Zip its CONTENTS, not the folder.
  index.html
  assets/
    hero-scrub.mp4   scroll-scrubbed hero, 6s, 1080p, keyframe every 8 frames
    hero-poster.jpg  first frame, painted before the video streams in
    hero-ending.jpg  last frame, reused as the static hero and CTA background
    logo-full.webp
    logo-mark.webp
    shots/           nine real app screenshots, captured from demo accounts
review/              design package and inspection files. Never deployed.
```

## How the hero works

The hero is a 600vh pinned region containing a sticky full-viewport stage. Scroll progress through it maps 0 to 1 and drives the video's `currentTime`, so scrolling down plays the film forward and scrolling up plays it backward. The video is fetched as a Blob behind a progress ring, because many hosts lack HTTP Range support and seeking silently breaks without it.

Five conditions serve a composed static image hero instead of the scrub: phones, portrait tablets, coarse-pointer portrait, landscape phones, and reduced motion. Those five media queries are written identically in the CSS and in the JavaScript, and they are re-evaluated live on rotation, resize and preference changes. Visitors on the static path never download the video or the poster.

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
