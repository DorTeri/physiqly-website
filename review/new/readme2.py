import io
p='README.md'
s=io.open(p,encoding='utf-8').read()
start=s.index("## How the hero works"); end=s.index("## The subpages")
new = """## How the hero works

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

"""
s = s[:start] + new + s[end:]
io.open(p,'w',encoding='utf-8',newline='\n').write(s)
print('README updated')
