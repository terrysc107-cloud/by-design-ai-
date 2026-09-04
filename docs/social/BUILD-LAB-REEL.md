# Build Lab reel — script

Format matches the locked crcst feature-reel spec: 1080×1920, 30fps, ~55s,
`eleven_v3` on Terry's clone at stability 1.0 / style 0.0, postTempo 1.2.
Reference render: `crcst-beta/content-out/feature-reels/f-adaptive-study.mp4`.

---

## The problem with this particular reel

The adaptive-study reel works because it films **the product**. Confidence taps,
the review queue, the dashboard — that footage *is* the feature.

The Build Lab has no app. There is nothing to film but a sales page, and a reel
of a sales page is an ad. The locked spec rules that out in its first paragraph:

> Each piece **leads with a real problem a specific audience has**, and the
> feature is the answer to that problem — never a tag bolted on the end. A
> feature bank that ignores this is just eight ads in a row.

**So this reel films a real board, not the Lab.** Terry has one that has been
running since June: a charter, floors, a promotion ladder, and fourteen dated
meetings it produced without being asked. That is the thing the Lab teaches you
to build, it is real, and it is on disk.

The Lab is the last six seconds. The board is the reel.

## 🔴 Redaction, before anything is filmed

`crcst-beta/docs/business/ceo/` is Terry's **real** board. It reads real revenue,
real pipeline and real customer names. Filming it puts all of that into a file
that is then posted publicly.

**Film a redacted copy.** Round the numbers, replace names with roles, keep the
structure and the shape of the output exactly as they are. The lesson is in the
structure; the values are the liability. This is the same rule as
`BOARD-DEMO-RECORDING.md` §1 and it is not optional here, because unlike a
cohort session this artifact goes to strangers by design.

---

## Reel definition

| Field | Value |
|---|---|
| `slug` | `f-build-lab` |
| `audience` | The operator whose AI only works on the days they sit down |
| `tag` / `eyebrow` | `THE BUILD LAB` |
| `hook` | A board that ran for three months without being asked. |
| `footer` | `Nov 18 · runyouraiboard.com/build-lab` |
| `footerBold` | `['Nov 18']` |

## Narration

~152 words. At 160 wpm that is ~57s, inside the 45–60s Shorts brief.

> Your AI only works on the days you sit down.
>
> You open the chat, explain your business again, get something useful, close
> the tab. Nothing persists. Nothing happens on a Tuesday when you're busy.
>
> A board is different. A few narrow assistants with written jobs, reading your
> real numbers, running on a schedule.
>
> This is one that's been running since June. Its charter. Its floors. Fifteen
> meetings it produced without anyone asking it to.
>
> The Build Lab is four Wednesdays where you build yours. Not a worked example.
> Your business, your numbers, in the room, eight people.
>
> And we skip Thanksgiving week on purpose. Your board runs two weeks
> unattended, and session two opens with what died. Because scheduled work
> doesn't error when it stops. It just goes quiet, and quiet looks exactly like
> a slow week.
>
> Four Wednesdays from November eighteenth. Link's in the bio.

## Beats

Asserted, not hoped for — the spec is explicit that the first adaptive cut
silently filmed 75s of dashboard and never reached the thing the narration was
about.

| # | On screen | Narration lands on |
|---|---|---|
| 1 | A chat window, a long prompt typed, then the tab closing | "only works on the days you sit down" |
| 2 | `CHARTER.md`, scrolled to the disposition line | "written jobs" |
| 3 | `GOALS.md`, a floor highlighted | "its floors" |
| 4 | `BOARD-MEETINGS/` directory listing, 14 dated files | "fourteen meetings" |
| 5 | One meeting open, the headline and a metrics row | "reading your real numbers" |
| 6 | `/build-lab`, the four-session table | "four Wednesdays" |
| 7 | The gap between Nov 18 and Dec 2 held on screen | "we skip Thanksgiving week" |
| 8 | Footer card | "November eighteenth" |

---

## Claims, gate-verified 2026-09-04

- **Four Wednesdays, Nov 18 / Dec 2 / Dec 9 / Dec 16** — `BUILD_LAB.sessions` in
  `micro-course-saas-template/lib/course-config.ts`, and the `ccc_lab_sessions`
  row `founding-run` (`starts_at` 2026-11-19T00:00Z = 7pm ET Nov 18).
- **Eight** — `ccc_lab_sessions.capacity = 8`. Said as the group size, never as
  "only N left": a remaining-seat count has to be computed from real
  registrations, and a reel cannot read the database.
- **Running since June** — `docs/business/ceo/BOARD-MEETINGS/` starts
  `2026-06-01.md`.
- **Fourteen meetings** — fourteen dated files in that directory, excluding
  `TEMPLATE.md`. The first draft of this script said fifteen; the gate caught it.
  Recount before every render, it grows weekly.
- **Thanksgiving week skipped** — Thanksgiving 2026 is Thu Nov 26; the four
  dates step over that week, which is why there are four and not five.
- **Scheduled work dies silently** — Terry's own 40-day run, already published
  in the guide and drip stage 3.

## Deliberately not said

- **Nothing about the Kit**, even though the Lab bundles it. The Kit promises
  "three months of meetings it actually produced" and that archive is currently
  about a week deep. It becomes true around the time the Lab runs, but it is not
  true on the day this reel posts, and a reel outlives its posting day.
- **No outcome, income or timeline promise.** No version of "and then your
  business runs itself."
- **No seat-scarcity count.** "Eight people" is the group size and comes from
  `capacity`. "Only three left" would be a number nothing in the render can back.
- **No price.** $997 is on the page. In a fifteen-second-attention format it
  reads as the point of the video, and the point is the board.
- **No claim the board decides or acts.** It produces analysis and drafts.

---

## What rendering needs

The crcst pipeline made the reference and is the right thing to reuse, but it is
not portable as-is:

1. **`BASE` is hardcoded** to `https://spdcertprep.com` in
   `scripts/video-pipeline/feature-reels.mjs:34`.
2. **`brand.config.mjs` is the SPD brand.** The Build Lab needs the AI by Design
   palette (`#1E1B17` / `#C9A84C`) and Geist.
3. **`ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` live in `crcst/.env.local`**,
   not in this repo. Render from there, or Terry pastes them here. Do not copy
   the values across repos in code.
4. **A redacted board copy** has to exist before a frame is shot.

Beats 2–5 are local files rather than a web app, so they render as styled HTML
in the same Playwright context — the same trick the guide illustrations use,
which means the frames will already match the brand.
