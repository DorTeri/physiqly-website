# Physiqly — Design Package

Tier 1, single journey. Written before generation. Every line of copy here ships verbatim.

**Revision, hero replaced.** The first hero was an abstract braid of light. It shipped and passed every gate, and is kept at `review/hero-scrub-braid-backup.mp4`. It was then replaced at the client's request with a literal brand film: a glowing dumbbell and a glowing leaf travel toward each other and forge into the Physiqly mark. The final frame is the real logo PNG, composited locally and handed to the model as a locked end frame, so the mark is never drawn by a model. The premise below is unchanged, because both films argue the same thing.

---

## 1. The brand premise

**Two strands, one thread.**

Physiqly's own logo is the argument: a dumbbell and a leaf fused into a single letter. Training and nutrition are not two jobs, and the tools a coach uses should not be two apps. Trainers today run one client across five products, and the research backs it: "One app for workouts, another tool for nutrition, spreadsheets for tracking progress, messaging apps for communication." The whole site teaches one idea, that all of it runs on one thread, and every section, the interactive moment and the closing line serve it. The signature element (the braid) is that idea drawn.

Audience: trainers. One call to action: book a demo.

---

## 2. The palette as CSS tokens

Sampled from Physiqly's real product surfaces and the footage's warm grade. Exact values finalized against the approved footage after the video gate.

```css
:root{
  --canvas:#0b0b0e;        /* the app's own ground, warm near-black, never pure #000 */
  --panel:#16161c;         /* cards and raised surfaces, the app's card color */
  --panel-2:#1a1a21;       /* hover / second tier surface */
  --accent:#ff6b35;        /* brand primary. CTA and rare emphasis ONLY */
  --accent-hover:#ff8a5b;
  --accent-muted:#ffb38f;  /* on-dark tint: small labels, icon strokes */
  --ember:#c44113;         /* deep footage amber: borders, glows, particles at whisper */
  --strand-cool:#38bdf8;   /* the second strand. Nutrition/data. Whisper doses only */
  --text-primary:#f7f7fa;
  --text-secondary:#a0a0b0;
  --hairline:#2a2a33;
  --border-interactive:#666676;  /* 3.2:1, meets WCAG 1.4.11 */
}
```

**Design-direction deviation, said out loud:** near-black with a warm accent is on the skill's banned-defaults list. It is earned here under the stated carve-out, because this genuinely is the subject's own material world: `#0b0b0e` and `#ff6b35` are defined in Physiqly's shipping `globals.css`, not reached for as a mood. The site must look like the product. What keeps it off the stock template: a geometric sans rather than the banned high-contrast serif, tones sampled from the real app and the footage, the braid as an invented signature, and no two adjacent sections sharing a skeleton.

---

## 3. The type trio

| Role | Face | Weights |
|---|---|---|
| Display | **Sora** | 600, 700 |
| Body | **Figtree** | 400, 500 |
| Mono / small labels | **IBM Plex Mono** | 400, 500 |

Sora is Physiqly's real wordmark face, so the site inherits the product's voice rather than inventing one. Figtree is a warm humanist geometric that sits quietly under Sora and carries more character than the habitual default. IBM Plex Mono carries the numbers, the section markers and the data readouts, which is right for a product whose whole surface is measurements.

---

## 4. The band map

Hero height 600vh (raised from 400vh so four beats each get a plateau in the 80 to 130vh band). Ranges below are the shipped values, validated by the flick test.

| Band | Range | Footage moment | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.22 | The dumbbell and the leaf hang far apart in drifting haze, unconnected | "Workouts here. Meals there. Progress in a spreadsheet." | Scatter (characters fly in from seeded offsets, echoing the scattered embers) |
| 2 | 0.26 to 0.48 | The two shapes turn and begin travelling toward each other, embers trailing behind them | "Five tools to coach one person." | Word-punch with overshoot on "Five" |
| 3 | 0.52 to 0.74 | The dumbbell and the leaf meet and forge into the mark, glowing molten | "Physiqly runs all of it in one place." | Weave (characters arrive alternating from above and below, echoing the two halves joining) |
| 4 | 0.78 to 1.00 | The mark has cooled into flat brand orange and sits still at frame centre, embers settling | "Coach the person. Not the paperwork." then the CTA row | Word-by-word rise into a staged settle (headline, then CTA) |

Bands 1 to 3 sit in the frame's calm upper third. **Band 4 is anchored to the lower third, not centred**, because the brand mark now occupies frame centre in the footage; centring the settle text would put the headline on top of the logo. The settle's own logo image and subline were removed for the same reason: the footage carries the mark, and repeating it read as two logos. Band 1 skips the opacity ease-in and gets the one-time load ramp so the hero opens with words already assembled. Band 4 skips the ease-out.

---

## 5. The static-hero copy block

For phones, portrait tablets, coarse-pointer portrait, landscape phones and reduced motion. Composed over the ending frame.

The ending frame carries the brand mark, so it is the static hero's image and there is no separate logo lockup. The scrim stays clear across the mark's band so the brand orange keeps its saturation, then ramps hard below it to carry the words.

- **Headline:** Coach the person. Not the paperwork.
- **Subline:** Physiqly puts the plan, the food, the progress and the messages for every client in one app.
- **CTA:** Book a demo
- **Secondary line under the CTA:** A 20 minute walkthrough. No card, no commitment.

---

## 6. The below-fold outline

Every section funnels to `#demo`. No two adjacent sections share a skeleton.

**6.1 The braid (the one interactive moment).** Layout: full-bleed, centered, minimal.
- Kicker: `THE ONE IDEA`
- Headline: "Hold to bring it together."
- Body: "On the left, the week you actually run. On the right, the same week in Physiqly. Press and hold."
- Mechanics: two vertical strands of scattered labels (Workouts, Meals, Weigh-ins, Messages, Payments) sit apart. Holding draws them together into one thread; on completion the merged labels light in sequence and a single line resolves: "One client. One thread." Releasing early eases the strands back apart, never snapping. Reduced motion shows the completed state with no hold required.

**6.2 You see who needs you before they go quiet.** Layout: text left, single phone right.
- Kicker: `TODAY'S DIGEST`
- Headline: "You see who needs you before they go quiet."
- Body: "Physiqly reads the week for you. Missed sessions, meals nobody logged, weight that stopped moving, weigh-ins going stale. It is on one screen the moment you open the app."
- Bullets: "Missed workouts, surfaced the same day." / "Nutrition that quietly stopped." / "Weight trends that flattened out." / "The client who needs a message today."
- Screenshot: `digest.png`

**6.3 Ten clients. One screen.** Layout: wide, screenshot leading, copy in a narrow column beneath. Deliberately not the mirror of 6.2.
- Kicker: `THE ROSTER`
- Headline: "Ten clients. One screen."
- Body: "Search, filter by goal, see every outstanding alert without opening a single profile. When your roster grows, the screen does not."
- Screenshot: `roster.png`

**6.4 The plan and the food in the same place.** Layout: two phones side by side, copy above them, centered.
- Kicker: `PLAN AND NUTRITION`
- Headline: "The plan and the food in the same place."
- Body: "Set the macros, build the day, and watch it land. Rest days carry their own carb target. Your client sees exactly what you set, meal by meal."
- Screenshots: `plan-meals.png`, `client-meals.png`
- Caption under left: "What you set." Caption under right: "What they see."

**6.5 What your client actually opens.** Layout: offset diptych, one phone raised above the other, copy in the gutter.
- Kicker: `THE CLIENT SIDE`
- Headline: "What your client actually opens."
- Body: "Their session is waiting when they wake up. Last week's weights are already in the field. Nobody has to be taught how to use it, which is the only reason a client sticks with an app at all."
- Screenshots: `client-home.png`, `client-training.png`

**6.6 It already knows the work.** Layout: three-across strip, equal treatment, each with its own screenshot.
- Kicker: `THE LIBRARIES`
- Headline: "It already knows the work."
- Three equal cards (every parallel element gets an image):
  - "Exercises" / "A full library with muscle groups, equipment and your own edits on top." / `exercises.png`
  - "Meals" / "Macros per 100g, client submissions waiting for your approval." / `meals-lib.png`
  - "Discover" / "Recipes and sessions your clients can pull straight into their week." / `discover.png`

**6.7 The questions trainers actually ask.** Layout: single column accordion, mono numbering, no images.
- Kicker: `STRAIGHT ANSWERS`
- Headline: "The questions trainers actually ask."
- FAQ, answering the objections found in research:
  - Q: "Is the price going to climb the moment I grow?"
    A: "The price is per tier of clients and the tiers are published. Nothing that appears in the app is a paid add-on you find out about later."
  - Q: "Will my clients actually use another app?"
    A: "They open one screen with today's session on it and a Start button. Last week's weights are already filled in. That is the whole ask."
  - Q: "Do I have to move everything over by hand?"
    A: "Exercises, meals and workouts import from a spreadsheet, so the library you already keep comes with you."
  - Q: "Does it really do everything, or will I still need other tools?"
    A: "Training, nutrition, supplements, weigh-ins, progress photos, messaging and your client billing are all in here. That is the point of it."
  - Q: "What happens to the messages I get at eleven at night?"
    A: "Clients send structured requests instead of open chat, so a question about swapping an exercise arrives as that, and it waits in one place instead of your personal phone."

**6.8 The call to action.** Layout: centered, the braid resolving behind it, the ending frame as the ground.
- Kicker: `SEE IT ON YOUR OWN ROSTER`
- Headline: "Bring one client. We will set them up live."
- Body: "Twenty minutes, screen shared, your actual training style. If it does not fit how you coach, you will know inside ten."
- Form microcopy:
  - Label / placeholder: "Your name" / "Jamie Rivera"
  - Label / placeholder: "Email" / "you@yourgym.com"
  - Label / placeholder: "How many clients do you coach?" / "12"
  - Button: "Book a demo"
  - Success state: "Booked. Check your email in the next few minutes and pick a time that suits you."
  - Handling on this static site: **decided with the user before the build** (mailto or a free form service). Whichever is chosen, the success state must tell the truth about where the message went.

**6.9 Footer.** Nav, the mark, and the honest line. Physiqly is a real product, so there is no fictional-brand disclosure. The screenshots are real screens from the app, populated with demo accounts, and the footer says so in one plain line: "Screens shown are the real app, filled with demo clients."

---

## 7. The vector layer plan

- **The braid (the signature).** One hand-drawn SVG spine running the full page height, behind the sections: two paths, one segmented and rigid (training), one continuous and curved (nutrition), crossing at each section boundary and finally merging into a single stroke at the CTA. Drawn with `stroke-dasharray` / `stroke-dashoffset` driven by scroll. Section markers (mono numerals) sit on the spine at each crossing. Remove it and the page loses its structure, which is the loudness test passed.
- **Ember field.** Whisper-level drifting particles in `--ember`, fixed behind everything, one slow 90 second cycle, so the whole page reads as one environment rather than stacked sections.
- **Per-section living element**, whisper level, four seconds or longer: a soft glow pulse on the active section's spine marker.
- **Reduced motion:** the braid renders fully drawn, particles hold still, the hold interaction shows its completed state, every drive stops.

---

## 8. The engineering list

The full standard from `scrub-pipeline.md`, named so the build cannot half-remember it: Blob fetch with the streamed loading ring and the 20 second watchdog; poster painted before the fetch starts; dt-normalized lerp in a rAF loop that rests; gated seeks with the error-path deadlock escape; delta-gated DOM writes; band pacing validated by the flick test at 120, 240 and 360px; the four-layer legibility system (base scrim, per-band scrim, text-shadow token, chip scrim) audited at 3.5:1 worst-frame contrast; the five static-hero gates matched character-for-character in CSS and JS and kept live with change listeners; complete-without-video; `overflow-x: clip` on html and body; reduced motion honored live in both directions; the quality floor in full. Plus the whole-site-animated standard: entrances everywhere, easing on everything, nothing snaps.

---

## 9. The copy gate line

Every viewer-facing line above ships verbatim. The built page must pass the Phase 9 grep gate (zero em dashes, zero stock words: leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions) plus the body-copy sweep for AI tells, before anyone sees it. The deliberate devices in this package are craft and stay: the triplet in band 1, the staccato of "Ten clients. One screen.", and the closing "Coach the person. Not the paperwork."
