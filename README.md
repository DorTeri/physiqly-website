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
with the headline in the open left third; a three-layer gradient veil darkens
only under the words and leaves the room and the two screens alone.

The shot is built in three passes, and the third one matters:

1. The scene is generated: a trainer's table at the edge of a dark gym, a
   laptop and a phone in hand, three people training softly out of focus
   behind. Composed so the left third stays empty for the headline.
2. The face of the woman on the bike is the real person, applied as a
   reference. She is at background depth of field, so she reads as someone in
   the room rather than a cut-out.
3. **The phone screen is not generated.** The model's version rendered the app
   as "Phyeliby" over rows of nonsense, which is what image models always do
   with dense interface text. The real `assets/shots/digest.webp` is instead
   warped into the screen's four corners with a homography
   (`review/new/screen_warp.py`), so those pixels are the actual product.
   The laptop keeps a generated spreadsheet on purpose: it is the old way, it
   is deliberately illegible, and it carries no application chrome, since an
   earlier take drew a recognisable Excel ribbon.

The corners are hardcoded in that script for this exact frame. Regenerate the
scene and they have to be re-read; `review/new/grid.py` draws the coordinate
grid used to find them, and `quadcheck.py` draws the quad back over the photo
to confirm it before warping.

Under 860px, and on any portrait screen up to 1024px, `<picture>` swaps in
`hero-portrait.jpg`, a vertical crop of the same frame, and the layout changes
shape: the photograph takes the top of the screen and the words sit on the
canvas beneath it. Overlaying them there was measured at 2.44:1 on an earlier
hero, and separating them puts every line on the same ground as the rest of
the page.

Worst-pixel contrast under every hero line, with the veil applied and the text
shadow ignored: 11.2:1 on the headline, 6.76:1 on the subline, 6.33:1 on the
kicker, 5.08:1 on the note, measured at 1440 wide. On phones the text is on
the canvas and runs 7.6:1 to 18.4:1.

The old scroll-scrubbed video hero, its two cuts and its posters are in
`review/retired-video/`. Nothing on the page fetches a video any more.

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
