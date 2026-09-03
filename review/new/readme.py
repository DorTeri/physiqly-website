import io
p = 'README.md'
s = io.open(p, encoding='utf-8').read()
start = s.index("## How the hero works")
end = s.index("## The subpages")
new = """## How the hero works

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

"""
s = s[:start] + new + s[end:]
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('README updated')
