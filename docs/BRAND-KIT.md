# By Design AI — Brand Kit

The single source of truth for everything brand-facing: identity, voice,
visual system, social handles, bios, and content rails.

If a value here ever conflicts with what's live on a platform, this file
wins — update the platform, not this doc (unless you're deliberately
changing the brand).

---

## 1. Brand Identity

| Field | Value |
|---|---|
| Brand name | **By Design AI** |
| Legal/short | By Design AI |
| Primary domain | **aixdesign.dev** |
| Owner | Terry (terrysc107@gmail.com) |
| Category | AI business coaching & consulting agency — lean, autonomous, custom systems |
| Tagline (primary) | **Stop learning about AI. Start running on it.** |
| Tagline (alt, problem-led) | Your business, solved by design. |
| Tagline (alt, ops-led) | Lean systems. Autonomous outcomes. |
| One-liner | We're an AI business coaching & consulting agency. We diagnose the bottleneck, design the system, and ship the lean, autonomous solution — custom to your business. |
| Primary CTA | **Book a Discovery Call** → calendly.com/terrysc107/15-min-ai-discovery-call |

### Mission
Help business owners replace busywork, broken handoffs, and bottlenecks
with lean, autonomous systems — so the business runs by design, not by
the owner's stamina.

### Positioning statement
> For business owners, operators, and small teams drowning in tools,
> tabs, and tasks that don't add up to outcomes, **By Design AI** is the
> AI coaching & consulting agency that diagnoses the real bottleneck and
> ships a lean, autonomous custom solution — unlike course-sellers,
> generalist VAs, or "AI consultants" who hand you a Notion doc and walk
> away.

### What we actually do (offer shape)
1. **AI coaching** — 1:1 and team sessions to install the right thinking
   and the right operating system for AI in your business.
2. **Consulting** — diagnostic engagement: map the workflow, find the
   bottleneck, prescribe the solution.
3. **Custom solution builds** — lean, autonomous systems built with
   whatever tool fits (see toolbox below). Shipped and handed over.
4. **Ongoing operating partner (retainer)** — we run the system, tune
   it, and add to it as the business grows.

### Toolbox (we use what fits — never tool-led)
GHL · Make.com · n8n · Zapier · OpenAI / Claude · Stripe · Twilio ·
Google Workspace · Supabase · Notion · Airtable · custom webhooks /
Node / Next.js when nothing off-the-shelf works.

> **Important:** GHL is *one* tool in the toolbox, not our identity.
> Never lead a bio, post, or pitch with "GHL specialist" — lead with the
> *problem we solve*, then mention the tool only if it's relevant.

### Audience (in priority order)
1. Business owners with a clear bottleneck (sales follow-up, ops,
   reporting, content, fulfilment) and no system to fix it
2. Coaches, consultants, and service founders running everything in
   their head + a calendar
3. Small teams (2–20 people) buried in tools that don't talk to each
   other
4. Operators inheriting a half-built stack who need a sane operating
   system, not more software
5. Agencies and creators who want AI-powered leverage without hiring

---

## 2. Voice & Tone

**Voice = how we always sound. Tone = how we sound right now.**

### Voice (4 dials)
- **Direct, not corporate.** Short sentences. No fluff. No "leverage synergies."
- **Builder, not guru.** We show the work. Screenshots, demos, real workflows.
- **Calm authority.** We've seen the broken setup before. We're not impressed
  by complexity — we're impressed by what runs without you.
- **Generous.** Free guide, free discovery call, free teardowns. The pitch
  is the proof.

### Tone by surface
| Surface | Tone |
|---|---|
| Landing page | Confident, premium, minimal |
| Email (lead magnet) | Helpful neighbor with a clipboard |
| Email (nurture) | Coach in your corner — short, useful |
| Twitter/X | Punchy, opinionated, screenshot-led |
| LinkedIn | Case-study-led, calm authority |
| Instagram/TikTok | Behind-the-build, "watch me automate this" |
| YouTube | Teach-by-doing, full walkthroughs |

### Words we use
diagnose • design • ship • lean • autonomous • system • bottleneck •
workflow • operator • by design • runs itself • get your time back •
custom • outcome

### Words we avoid
synergy • cutting-edge • revolutionary • disruptive • leverage •
"AI-powered" (we *use* AI; we don't slap the word on things) •
"ninja" / "rockstar" / "guru" • "let's hop on a call"

### Hard rules
- Never claim a result we can't show.
- Never use stock "AI brain" / glowing-grid imagery.
- Never write a CTA other than **Book a Discovery Call** as the primary
  ask (lead magnet is the secondary).

---

## 3. Visual Identity

### Colors (from `tailwind.config.ts`)
| Token | Hex | RGB | Use |
|---|---|---|---|
| `background` | `#1E1B17` | 30,27,23 | Page background, dominant surface |
| `gold` | `#C9A84C` | 201,168,76 | Primary brand, CTAs, accents |
| `gold-dim` | `rgba(201,168,76,0.15)` | — | Soft fills, hover backgrounds |
| `gold-border` | `rgba(201,168,76,0.4)` | — | Borders, dividers |
| Text primary | `#FFFFFF` | 255,255,255 | Body on dark |
| Text secondary | `#A8A29E` (stone-400) | — | Muted copy |

**Contrast rules:** Gold on `#1E1B17` is the signature pair. Never use gold
on white. Never use gold text smaller than 14px (it loses legibility).

### Typography
- **Display + body:** Geist Sans (`var(--font-geist-sans)`, fallback
  `system-ui, sans-serif`)
- Weights in use: 400, 500, 600, 700
- Tracking: tight on display (`-0.02em`), normal on body

### Logo / mark
- Wordmark: **By Design AI** set in Geist Sans 600, gold on dark
- Short mark: **bd** or **bdAI** (lowercase, gold)
- Favicon: gold `bd` glyph on `#1E1B17`

### Imagery system
- **Background:** dark, grainy, gold radial-gradient (`bg-gold-radial`)
- **Motion:** subtle — `float`, `gold-pulse`, `grain`, `slide-up`
- **Photography:** dim, high-contrast, gold-tinted highlights
- **Never:** glossy 3D AI brains, robot hands, blue circuit overlays

### Asset locations
- Hero video + section bgs: see `lib/cta.ts → ASSETS`
- Guide PDF: `public/guide.pdf`
- (TODO) Logo SVGs: `public/brand/logo-wordmark.svg`, `public/brand/logo-mark.svg`
- (TODO) Open Graph image: `public/og.png` (1200×630)

---

## 4. Social Handles

### Handle priority order
1. `@bydesignai` (preferred everywhere)
2. `@bydesign_ai` (underscore fallback)
3. `@bydesignaiagency` (when 1 + 2 taken)
4. `@aixdesign` (matches domain `aixdesign.dev`)
5. `@bydesignai.dev` (only where dots allowed)

**Rule:** claim the same handle on every platform you can, even ones you
don't plan to post on. Squatting protects the brand.

### Platform-by-platform plan

| Platform | Handle (try in order) | Display name | Notes |
|---|---|---|---|
| X / Twitter | `@bydesignai` → `@bydesign_ai` → `@aixdesign` | By Design AI | 15-char max |
| Instagram | `@bydesignai` → `@bydesign.ai` → `@bydesignai.agency` | By Design AI | Dots allowed |
| TikTok | `@bydesignai` → `@bydesign.ai` | By Design AI | Dots allowed |
| LinkedIn (Company) | `linkedin.com/company/bydesignai` | By Design AI | Also claim personal: `linkedin.com/in/terry-bydesignai` |
| YouTube | `@bydesignai` → `@bydesignai-agency` | By Design AI | Handle = `@`; channel name = display |
| Facebook (Page) | `facebook.com/bydesignai` | By Design AI | Needed for Meta ads + IG cross-post |
| Threads | `@bydesignai` (inherits IG) | By Design AI | Auto-created from IG |
| Pinterest | `@bydesignai` | By Design AI | Optional — only if doing visual carousels |
| GitHub | `github.com/bydesignai` | By Design AI | Useful: post snapshots, scripts |
| Medium / Substack | `bydesignai` | By Design AI | Substack = newsletter mirror |
| Reddit | `u/bydesignai` | — | Lurk first, don't spam |
| Discord (server) | `By Design AI` | — | Optional community |
| Skool | `By Design AI` | — | If launching a paid community later |
| Email (brand) | `hello@aixdesign.dev` | By Design AI | Already used as Resend FROM |

---

## 5. Bios (copy-paste ready, character limits respected)

### Twitter/X — 160 chars
> AI business coaching & consulting. We diagnose the bottleneck and ship
> the lean, autonomous system. Custom to your business. Free call ↓

**(157 chars — fits)**

### Instagram — 150 chars
> AI coaching · consulting · custom builds.
> Lean systems. Autonomous outcomes.
> Free 30-min discovery call ↓

**(125 chars — fits)**

### TikTok — 80 chars
> AI coaching + custom automations. Watch us solve it. Free call ↓

**(64 chars — fits)**

### LinkedIn Company — 2,000 chars (using ~700)
> **By Design AI** is an AI business coaching & consulting agency.
>
> We work with owners, operators, and small teams who are buried in
> tools, tabs, and tasks that don't add up to outcomes. We diagnose the
> real bottleneck, design the right system, and ship a lean, autonomous
> custom solution — built with whatever tool actually fits.
>
> How we work:
> • **AI Coaching** — 1:1 & team sessions to install the operating
>   system for AI in your business
> • **Consulting** — diagnostic engagements; map the workflow, find the
>   bottleneck, prescribe the fix
> • **Custom Solution Builds** — automations, AI workflows, integrations,
>   and internal tools, shipped and handed over
> • **Operating Partner (Retainer)** — we run, tune, and grow the system
>   as your business changes
>
> Toolbox (we're tool-agnostic): OpenAI / Claude, Make.com, n8n, Zapier,
> Go High Level, Stripe, Twilio, Supabase, Notion, Airtable, and custom
> code when off-the-shelf won't cut it.
>
> Book a free 30-min discovery call: aixdesign.dev

### LinkedIn Personal (Terry) — headline 220 chars
> Founder, By Design AI · AI business coaching, consulting & custom
> automation · We diagnose the bottleneck and ship the lean system that
> solves it · Free discovery call ↓

### YouTube — 1,000 chars (using ~500)
> By Design AI is an AI business coaching & consulting agency. On this
> channel: real business bottleneck teardowns, "watch me solve this"
> custom builds, AI workflow walkthroughs, and the operating-system
> thinking behind lean, autonomous businesses.
>
> If you're an owner or operator drowning in tools and tasks — start here.
>
> 🔗 Free 30-min discovery call → aixdesign.dev
> 📩 hello@aixdesign.dev

### Facebook Page — short description, 255 chars
> AI business coaching & consulting agency. We diagnose your bottleneck
> and ship a lean, autonomous custom solution. Tool-agnostic, outcome-led.
> Free discovery call → aixdesign.dev

### GitHub — 160 chars
> By Design AI — AI coaching, consulting & custom automation. Open
> recipes & scripts we use in client builds. aixdesign.dev

### Substack / Medium — 300 chars
> Field notes from an AI business coaching & consulting agency.
> Bottleneck teardowns, custom automation builds, and the
> operating-system thinking behind lean, autonomous businesses.
> Written by Terry @ By Design AI.

### Email signature
```
Terry — Founder, By Design AI
AI coaching, consulting & custom builds. Lean systems. Autonomous outcomes.
aixdesign.dev · hello@aixdesign.dev
Book a 30-min call → calendly.com/terrysc107/15-min-ai-discovery-call
```

---

## 6. Profile assets (specs)

| Asset | Size | Notes |
|---|---|---|
| Square avatar (all platforms) | 400×400 | Gold `bd` mark on `#1E1B17`. Safe-zone 80%. |
| X header | 1500×500 | Wordmark left, tagline right, gold radial bg |
| LinkedIn Company banner | 1128×191 | Wordmark + "Go High Level specialists" |
| LinkedIn Personal banner | 1584×396 | Photo of Terry + tagline + CTA URL |
| YouTube banner | 2560×1440 (safe 1546×423) | Wordmark center, schedule below |
| YouTube end-screen | 1920×1080 | "Book a call" + subscribe |
| Facebook cover | 1640×924 | Same as LinkedIn banner, re-cropped |
| Open Graph (site) | 1200×630 | Wordmark + tagline + CTA |
| Default share card | 1200×1200 | Square version for IG/Threads |

**Naming convention** in `public/brand/`:
`bda-{platform}-{asset}-{w}x{h}.{ext}` →
e.g. `bda-x-header-1500x500.png`

---

## 7. Link-in-bio structure

Use one stack (Beacons / Linktree / Stan / your own `/links` page) so every
platform points to the same hub.

Order matters — top link gets ~60% of clicks:

1. **Book a free 30-min discovery call** ← primary
2. Free GHL automation guide (PDF)
3. See what we build (case studies / portfolio)
4. Get a snapshot quote
5. Email us → hello@aixdesign.dev

Recommend building `/links` on `aixdesign.dev` so you own the analytics
and can fire pixels — see §10.

---

## 8. Hashtag & keyword strategy

### Core tags (always-on)
`#aiforbusiness` `#aiautomation` `#aiconsulting` `#aicoaching`
`#businesssystems` `#smallbusinessautomation` `#leanbusiness`

### Niche / rotation
`#openai` `#claudeai` `#makedotcom` `#n8n` `#zapier` `#gohighlevel`
`#agenticworkflows` `#operatingsystem` `#solopreneur` `#agencyowner`
`#coachingbusiness` `#consultantlife` `#smbsystems`

### Per-platform rules
- **X:** 0–2 tags max. Prose-first.
- **LinkedIn:** 3–5 tags at the end.
- **Instagram:** 8–15 tags, mix volume (`#gohighlevel` = high) + niche
  (`#ghlsnapshot` = low) + branded (`#bydesignai`).
- **TikTok:** 3–5 tags + 1 trending sound tag.
- **YouTube:** 3–5 in description; 1 in title only if natural.

### Branded
Always include **`#bydesignai`** so we can collect UGC + repurpose.

---

## 9. Content pillars (the only 4 things we post)

1. **Bottleneck teardowns** — "Here's where this business is leaking
   time/money, and the lean system that fixes it." Anonymised or
   permissioned real examples.
2. **Build in public** — "Watch us ship the custom solution." Loom,
   screen-record, 60-sec phone clip. Show the actual tool we picked and
   *why*.
3. **Primitives** — Reusable patterns: prompts, AI workflows, automation
   recipes, decision frameworks. "Steal this."
4. **Proof & principles** — Client outcomes (with permission), and the
   operating-system thinking behind lean, autonomous businesses.

**Ratio per week:** 2 · 1 · 2 · 1 (six pieces total).

**Every post ends with one of two CTAs:**
- Soft: "Free guide in bio."
- Hard: "Book a 30-min build call. Link in bio."

---

## 10. UTM + tracking convention

Use these on every link you post so we know what works:

```
?utm_source={platform}
&utm_medium={format}
&utm_campaign={topic}
&utm_content={asset-id}
```

- `utm_source`: `x` · `linkedin` · `instagram` · `tiktok` · `youtube` ·
  `facebook` · `email` · `substack`
- `utm_medium`: `bio` · `post` · `story` · `dm` · `video` · `nurture`
- `utm_campaign`: short slug, e.g. `ghl-teardown-2026q2`
- `utm_content`: post id / asset filename

Example:
```
https://aixdesign.dev/?utm_source=linkedin&utm_medium=post&utm_campaign=snapshot-of-week&utm_content=2026-06-03-roofing
```

---

## 11. Posting cadence (start here, tune later)

| Platform | Cadence | Format |
|---|---|---|
| X / Twitter | 1–2 / day | Screenshot + 2-sentence insight |
| LinkedIn | 3 / week | Case study, teardown, or primitive |
| Instagram (Reels) | 3 / week | 30–60s vertical build clips |
| TikTok | 3–5 / week | Same Reels, captioned natively |
| YouTube (long) | 1 / week | 8–15 min teardown/build |
| YouTube Shorts | 3 / week | Repurposed Reels |
| Email (newsletter) | 1 / week (Tue) | "Snapshot of the week" |

---

## 12. Automation hooks (how this plugs into the stack)

- **Source of truth:** post first to one channel (usually a 60-sec phone
  clip or a screenshot + paragraph), then fan out via the automation
  pipeline.
- **Repurposing:** long YouTube → Shorts → Reels/TikTok → X thread →
  LinkedIn carousel → newsletter. Build this in Make.com / n8n.
- **Lead capture from social:** every bio link → `/links` on
  `aixdesign.dev` → `/guide` lead magnet → Resend nurture → Calendly.
  (Already wired — see `memory/DECISIONS.md` § Resend.)
- **CRM:** every booking webhook → GHL contact + tag
  `source:{platform}` (set in Calendly webhook handler).
- **Analytics:** UTMs land in GA + Supabase `leads` table; weekly digest
  email summarises top-converting `utm_source`.

---

## 13. Setup checklist (do these in order)

- [ ] Claim `@bydesignai` on: X, Instagram, TikTok, YouTube, Threads,
      Facebook, Pinterest, GitHub, Substack, Reddit, Medium
- [ ] Set display name = **By Design AI** on every platform
- [ ] Paste the right bio from §5 into each profile
- [ ] Upload avatar (§6) — same image on every platform
- [ ] Upload header/banner (§6) per platform spec
- [ ] Add link-in-bio URL → `aixdesign.dev/links` (build the page)
- [ ] Verify Facebook Page → connect Instagram Professional account
- [ ] Verify Twitter/X for blue-check eligibility (optional)
- [ ] Create LinkedIn **Company Page** + tag Terry as employee
- [ ] Set Resend FROM to `By Design AI <hello@aixdesign.dev>` (already
      in README §3) and verify domain in Resend
- [ ] Add `og.png` + favicon to `public/` (specs in §6)
- [ ] Drop logo SVGs in `public/brand/`
- [ ] Add `/links` page to the Next.js app (Phase 04 candidate)
- [ ] Wire Calendly webhook to tag GHL contact `source:{utm_source}`

---

## 14. Don'ts (brand-protection)

- Don't post anything without a CTA.
- Don't use emoji-heavy "🚀✨💎" captions — off-brand.
- Don't repost generic AI hype. We're a build shop, not a news desk.
- Don't dunk on named competitors. Teardowns are about the *setup*, not
  the person.
- Don't share client data without written approval — blur the names.
- Don't claim certifications/partnerships we don't have (HighLevel,
  OpenAI, etc.).
