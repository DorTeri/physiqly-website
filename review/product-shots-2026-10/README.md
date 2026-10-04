# Product shots — 2026-10-04

Real screenshots of the current Physiqly app (commit `303c69c`, Trainer Home redesign), captured from the sales-demo coach **Lior Avital** and her client **Noa Cohen** in the **default Physiqly brand**. Nothing inside a screenshot was redrawn; compositions only place the real captures in browser/phone frames over a dark background with an orange glow.

Not deployed: `review/` is never shipped. The public site (`physiqly/index.html`) is unchanged.

- `compositions/`: marketing-ready (3200×2000, or 2400×2000 for 06). Use the `.webp`; the `.png` is the lossless master.
- `screens/`: the individual real captures, cropped. Desktop is 2× (2880 wide), mobile is 3× (1170×2532).
- `tooling/`: the scripts that produced them, for a recapture.

## Which shot goes where

| Website section | Composition | Real screen(s) inside |
|---|---|---|
| Hero: "Who needs you today?" | `01-hero-trainer-home` | Trainer Home (desktop) + Trainer Home (mobile): "4 clients need you", Physy with "11 decisions are ready. Start with Michal?", the focal decision, Today's work |
| "Your morning is already handled" | `02-handle-my-morning` | Handle my morning, step 8 of 11 (Tal): reason, evidence, **Physiqly prepared: Reduce intake by 140 kcal/day**, the before → after, why (including "Your rule"), Approve / Keep current |
| "It learns you" | `03-coach-brain` | AI Coach → Approach (the coach's philosophy) + the Coaching-rules sheet "Physiqly noticed": *Keep drafted messages to 15 words or fewer*, "You shortened 6 of 6 drafts…", recent cases, Add rule |
| "Everything underneath the AI" (training + nutrition) | `04-training-and-nutrition` | Client file → Training (program review overdue, the cycle's adherence/PRs, the editable program) over Client file → Nutrition (macro targets, meal plan) |
| "Built for the client too" | `05-client-experience` | Client app (Noa): Training · Home · Nutrition |
| Mobile trainer | `06-mobile-trainer-home` | Trainer Home (mobile) + Morning step (mobile) |
| "10 clients, 60 clients. You still know who needs you" | `07-clients-roster` | Clients list: status, top reason, nutrition 7d, streak, last message |
| Progress (optional) | `08-client-progress` | Client file → Progress (12-week weight chart, how they feel) + the client's own Weight screen |

Extra single screens in `screens/` you may want: `morning-message-draft` (Michal: an AI-drafted check-in, Send / No change needed), `morning-program-review` (Gal: Review program / Keep program), `client-overview-prepared-change` (Tal's client file with the weekly report and the prepared change), `ai-coach-control-center`, `mobile-client-weight`.

## How the demo state was prepared (all in the DEV database, never production)

1. The sales demo (`scripts/seedDemo.ts`) was created in the dev Neon DB: 16 clients, every state produced by the app's own logic (Radar, attention model, weekly-report builder, target-change builder with the coach's rules). The run self-verified 16/16 personas: 4 need you · 7 watch · 3 on track · 2 not joined.
2. **Physiqly look:** `demoPhysiqlyLook.ts` (also at `TrainMe/scripts/`) cleared the demo coach's published brand (no AVITAL name, teal/gold colours, logo or background; Classic style, dark base). White-label is untouched; "Reset demo completely" restores the AVITAL brand.
3. **English:** the demo's data is Hebrew. `localizeEn.ts` / `statsEn.ts` translated the DATA (names → their English persona names, workout names, memories, notes, messages, check-in notes, weekly-report prose, AI philosophy and scenario answers). The UI is the app's own English.
4. **Coach Brain evidence:** `seedDecisions.ts` added six past Morning decisions where the coach shortened Physiqly's draft before sending (the ledger rows and chat messages the real send path writes). The app's own detector then produced the "15 words or fewer" proposal; nothing about the proposal was written by hand.
5. Captured from a production build of the app (`marketingServer.mjs`, port 3005, dev DB only; demo avatars served locally because the dev bucket isn't configured).

A demo refresh/reset regenerates the Hebrew data, so re-run 3 and 4 after one before recapturing.

## Honest gaps: concept visuals with no matching real screen

- **Per-client adherence rings and progress sparklines in the roster** (concept's "10 clients. 60 clients."): the real Clients table shows text ("Calories 93% · Protein 98%"), not rings or sparklines.
- **A weight-trend chart inside the Morning decision** ("82.1 → 82.0 kg, 17 days stable"): Morning shows evidence as text lines; there is no chart there.
- **Coaching rules written as free-text philosophy rules** ("Never automatically respond to injury-related messages"): real rules are structured (calorie step, adherence bar, message length, quiet signal). The injury rule is a built-in safety behaviour, stated on the AI Coach page ("Pain, injury and unusual symptoms always go to you"), not a rule card.
- **The client "Workout" screen with an exercise photo and a "Log set" button**: the real client Training view is the exercise cards with weight / reps fields (`mobile-client-training`).
- **Check-ins as a separate product tab**, and the stats band (60+ coaches, 4.8 h saved per week, 92% approved without editing): these aren't product screens. Use the stats only if you have real numbers behind them.
- **Client Training** shows each exercise's Hebrew library name under the English one (`היפ תראסט` under "Hip Thrust"). That is deliberate app behaviour for Israeli gyms, but it reads oddly on an English site.
- **Avatars:** some trainer surfaces show initials instead of the client photo (Watch rows, "Worth celebrating", the client-file header). That is the real app; a product fix would make the shots look more finished.
