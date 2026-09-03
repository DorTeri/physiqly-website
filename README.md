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

The shot is built in three passes:

1. The scene is generated: a trainer's table at the edge of a dark gym, a
   laptop and a phone in hand, three people training out of focus behind.
   Composed so the left third stays empty for the headline.
2. The woman on the bike is a real person, applied as a face reference. Two
   things had to be said explicitly in the prompt, because the first attempts
   got both wrong: her head must be in proportion to her body and no larger
   than the heads of the men at the same distance, and she looks forward over
   the handlebars, mid effort, not at the camera. A face swapped onto a
   background figure tends to arrive oversized and posing for the lens, and
   both read instantly as fake.
3. **The phone screen is not generated.** The model's version rendered the app
   as "Phyeliby" over rows of nonsense, which is what image models do with
   dense interface text. So the scene is generated with the phone switched
   off, and the real `assets/shots/digest.webp` is warped into the screen's
   four corners with a homography (`review/new/warp2.py`). The glass
   reflection from the blank screen is carried onto the result, and the notch
   is pasted back, so it reads as a screen rather than a sticker.

   The laptop keeps a generated spreadsheet on purpose: it is the old way, it
   is deliberately illegible, and it carries no application chrome, since an
   earlier take drew a recognisable Excel ribbon.

**The corners are hardcoded per frame.** Regenerate the scene and they must be
re-read, even if the edit was only meant to touch someone's face. `grid.py`
draws a labelled coordinate grid over the phone, `quad2.py` draws the
candidate quad back over the photo, and that second step is not optional: the
first attempt shipped with the bottom-left corner out on the hand, so the app
painted over the fingers.

Under 860px, and on any portrait screen up to 1024px, `<picture>` swaps in
`hero-portrait.jpg`, a vertical crop of the same frame, and the layout changes
shape: the photograph takes the top of the screen and the words sit on the
canvas beneath it. Overlaying them there measured 2.44:1 on an earlier hero;
separating them puts every line on the same ground as the rest of the page.

Worst-pixel contrast under every hero line, with the veil applied and the text
shadow ignored: 11.95:1 headline, 8.11:1 kicker, 6.7:1 subline, 4.93:1 note,
at 1440 wide. On phones the text is on the canvas and runs 7.6:1 to 18.4:1.

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
