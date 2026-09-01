# Physiqly website

A one-page site for Physiqly, aimed at personal trainers. Plain HTML, CSS and vanilla JavaScript. No build step, no framework, no npm.

## Layout

```
physiqly/            <- the deploy folder. Zip its CONTENTS, not the folder.
  index.html
  privacy/index.html   legal, ported from the app's own copy
  terms/index.html     legal, ported from the app's own copy
  refunds/index.html   legal, ported from the app's own copy
  support/index.html   contact and the four questions people actually ask
  assets/
    hero.jpg           the hero photograph, 16:9, for landscape screens
    hero-portrait.jpg  the vertical cut of the same frame, for phones
    night-desk.jpg     the band opening the AI Coach section
    coach-floor.jpg    the band opening the client-side section
    gym-floor.jpg      the background behind the demo form
    pages.css          the four subpages; index.html stays self-contained
    logo-full.webp
    logo-mark.webp
    shots/             nine real app screenshots, captured from demo accounts
review/              design package and inspection files. Never deployed.
  new/               the generated photographs at full resolution
  retired-video/     the old scroll-scrubbed hero and its stills
```

## How the hero works

One photograph, no video. `hero.jpg` is a full-bleed `object-fit: cover` image
with the headline in the calm left third; a three-layer gradient veil darkens
only under the words and leaves the trainer and the orange phone glow at full
strength.

The shot is generated, and the Physiqly mark on the shirt is the real logo
applied afterwards with image editing, not something the model invented. The
only warm light in the frame comes off the phone, so the brand orange and the
product are the same thing.

Under 860px, and on any portrait screen up to 1024px, `<picture>` swaps in
`hero-portrait.jpg` and the layout changes shape: the photograph takes the top
of the screen and the words sit on the canvas beneath it. They used to be
overlaid there too, but the vertical cut puts the phone glow and the mark on
the shirt exactly where a headline block lands at 375px, which measured
2.44:1 on the kicker. A gradient deep enough to fix that buried the mark as
well, so the two were separated instead.

Worst-pixel contrast under every hero line, with the veil applied and the text
shadow ignored: 9.3:1 on the kicker, 7.05:1 on the headline, 5.23:1 on the
subline, 5.96:1 on the note, measured at 1440 wide.

The old scroll-scrubbed video hero, its two cuts and its posters are in
`review/retired-video/`. Nothing on the page fetches a video any more, and the
whole `assets/` folder is now under 1 MB.

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

Double-clicking `index.html` works, since nothing on the page is fetched by
JavaScript any more. A local server is still the honest preview:

```bash
npx http-server physiqly -p 8085 -c-1
```

## Screenshots

Captured from the app's demo accounts (`guy.egozin@trainme.app` and `tom.levi@trainme.app`), never from real client data. Recapture with the app running on `localhost:3000`.

## Deploy

Zip the CONTENTS of `physiqly/` so `index.html` sits at the zip's top level, then deploy as a static site. Patch the `<!-- DEPLOY STEP -->` og tags with the live URL first.
