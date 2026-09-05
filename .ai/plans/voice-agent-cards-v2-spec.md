# Task: Redesign /voice-agent use-case cards + hero polish (v2 visual pass)

## Context
Repo: /Users/terry/code/by-design-ai-
The `/voice-agent` "coming soon" waitlist page already exists and is fully
functional (built in a prior pass): `app/voice-agent/page.tsx`,
`app/voice-agent/_components/VoiceAgentWaitlistForm.tsx`,
`app/voice-agent/_components/VoiceAgentFooter.tsx`, plus the API route and
Supabase-backed waitlist library. **All copy is approved and final — do not
change any headline, body text, use-case description, form copy, disclaimer
text, or legal/consent language.** This is a VISUAL/MOTION pass only.

Terry's feedback: "Looks good for version one, solid copy, need a more modern
immersive layout though with immersive cards."

Clarified direction (already decided, do not re-litigate):
1. Cards should scroll-reveal with a staggered fade-up animation as the
   viewport reaches the use-case grid section.
2. Cards should have subtle hover depth: glow, lift, and slight tilt
   (something like a gentle 3D tilt-on-hover, not aggressive/gimmicky).
3. Each use-case card gets a small icon/visual representing its category
   (customer service, voicemail replacement, after-hours coverage,
   restaurants/order-taking).
4. Motion should be tasteful and subtle — this is a professional B2B SaaS
   brand (AI by Design), not a flashy consumer app. Respect existing
   `useReducedMotion` accessibility pattern already used elsewhere in this
   repo (see `components/ui/CTAButton.tsx` and `components/ui/TextReveal.tsx`
   for the established convention — follow it, don't reinvent it).

## Stack constraints — read before writing code
- `framer-motion` (^11.18.2) is ALREADY a project dependency. Use it. Do not
  add a new animation library.
- No icon library (lucide-react, heroicons, etc.) is installed. Do NOT add
  one as a new dependency. Use small inline SVG icons (simple, minimal,
  single-color/monochrome matching the existing gold/white palette) — either
  as new tiny local SVG files under `public/brand/` or as inline React SVG
  components colocated with the card component. Keep them lightweight (no
  complex multi-path icon sets) — think simple line-icon style: a phone
  handset, a voicemail/message icon, a clock/moon (after-hours), a
  fork-and-knife or receipt icon (restaurant/order-taking).
- Read `docs/BRAND-KIT.md` again before choosing any new color — reuse the
  existing gold/`text-gold`/`bg-gold-dim`/`border-gold-border` tokens already
  used on this page; do not invent a new accent color.
- Existing Tailwind utility classes (`section`, `section-wide`, `cta-btn`,
  `gold-rule`, etc.) are project conventions — reuse them, don't duplicate.

## Scope — files you may touch
- `app/voice-agent/page.tsx` — restructure the use-case section markup as
  needed to support the new card component and motion wrapper. Do not touch
  any other section's copy or structure beyond what's needed to swap in the
  new card component.
- NEW: `app/voice-agent/_components/VoiceAgentUseCaseCard.tsx` — the new
  animated/interactive card component (props: heading, body, icon).
- NEW: small SVG icon components/files as described above (co-located under
  `app/voice-agent/_components/icons/` or similar — your call, keep it clean).
- Do NOT touch: `VoiceAgentWaitlistForm.tsx`, `VoiceAgentFooter.tsx`, the API
  route, any lib/*.ts waitlist files, the SQL migration, or any file outside
  the `/voice-agent` route and its own components/icons.
- Do NOT touch any pre-existing modified/untracked file from before this task
  (app/page.tsx, app/education/page.tsx, app/blog/[slug]/page.tsx,
  .ai/HANDOFF.md, components/sections/TheBoardReel.tsx,
  components/ui/FiveThingsVideo.tsx, content/blog/*, public/video/, video/).

## Requirements
1. Staggered scroll-reveal: each card fades/slides up into view as the
   section enters the viewport, with a slight delay between cards (stagger),
   using `whileInView` (matching the existing `TextReveal.tsx` pattern) —
   not a scroll-linked/parallax transform, just a clean reveal-once-on-view.
2. Hover interaction per card: subtle lift (translateY), a soft gold glow
   (box-shadow or a gold-tinted radial glow), and a slight 3D tilt effect
   tracking cursor position OR a simpler uniform tilt/scale — pick whichever
   framer-motion pattern is cleanest and most performant; do not require a
   heavy pointer-tracking library.
3. Icon at the top of each card, small, monochrome, consistent stroke width,
   matching the gold/white palette already on the page.
4. Respect `prefers-reduced-motion` — when reduced motion is requested, cards
   should appear immediately with no transform animation (opacity fade only
   or instant), matching how `TextReveal.tsx`/`CTAButton.tsx` already handle
   `useReducedMotion()`.
5. Must not regress Lighthouse/performance meaningfully — keep the animation
   GPU-friendly (transform/opacity only, no layout-thrashing properties).
6. Must not break existing tests. Run and report the existing test suite for
   this route (`npx tsx --test tests/voice-agent-waitlist*.test.ts` and
   `scripts/test-voice-agent-page.mjs` if it does DOM/visual assertions —
   check whether it needs updating for the new card markup, and update it
   if it makes structural assertions about the old card markup, but do not
   remove or weaken any assertion, only adapt it to the new DOM structure).
7. `npm run build` and `npx tsc --noEmit` must both stay clean.

## Verification required (report exact results, not summaries)
- `npx tsc --noEmit --incremental false`
- `npm run build`
- `npx tsx --test tests/voice-agent-waitlist.test.ts tests/voice-agent-waitlist-rate-limit.test.ts`
- `node scripts/test-voice-agent-page.mjs` (update if needed for new markup,
  report what you changed and why)
- Confirm via `git status --short` that no file outside the allowed scope
  above was touched.

## Definition of Done
- [ ] New `VoiceAgentUseCaseCard.tsx` component with icon, scroll-reveal,
      stagger, and hover glow/lift/tilt.
- [ ] Four simple monochrome SVG icons matching the brand palette.
- [ ] `prefers-reduced-motion` respected (no animation/transform when set).
- [ ] All copy byte-identical to before this task.
- [ ] Build, typecheck, and existing tests pass — exact reported output.
- [ ] No file outside declared scope touched (verified via git status).
- [ ] Brief note on what tradeoff was made for the hover-tilt implementation
      (pointer-tracked vs. simpler uniform tilt) and why.
