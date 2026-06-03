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
| Category | GHL (Go High Level) specialist agency + AI automation |
| Tagline (primary) | **Stop learning about AI. Start running on it.** |
| Tagline (alt, GHL-led) | GHL, built by design. |
| Tagline (alt, ops-led) | Your business, automated by design. |
| One-liner | We design, build, and run GHL + AI automations so your business operates by design — not by accident. |
| Primary CTA | **Book a Discovery Call** → calendly.com/terrysc107/15-min-ai-discovery-call |

### Mission
Turn fragmented small-business operations into integrated GHL + AI systems
that run themselves — so owners get their time back and their numbers up.

### Positioning statement
> For agencies, coaches, and local service businesses on Go High Level
> who are tired of patchwork setups and half-finished automations,
> **By Design AI** is the specialist build partner that designs, deploys,
> and operates GHL + AI workflows end-to-end — unlike generalist VAs or
> "AI consultants" who hand you a Notion doc and walk away.

### Audience (in priority order)
1. Agencies reselling GHL who need snapshot/automation builds
2. Coaches & consultants running their business on GHL
3. Local service businesses (home services, med-spa, fitness, real estate)
4. Marketing teams inheriting a broken GHL setup
5. Operators who want AI layered into existing GHL workflows

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
build • ship • automate • workflow • snapshot • by design • operator •
system • runs itself • get your time back

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
> GHL specialist agency. We design, build & run Go High Level + AI
> automations so your business runs by design — not by accident.
> Free build → ↓

**(150 chars — fits)**

### Instagram — 150 chars
> Go High Level + AI automations, built by design.
> Snapshots · Workflows · AI ops
> Free 30-min build call ↓

**(140 chars — fits)**

### TikTok — 80 chars
> GHL + AI automations. Watch us build. Free discovery call ↓

**(60 chars — fits)**

### LinkedIn Company — 2,000 chars (using ~600)
> **By Design AI** is a Go High Level specialist agency. We design, build,
> and operate the GHL + AI systems that small businesses, coaches, and
> agencies actually need to run — not just look at.
>
> What we ship:
> • GHL Account Setup & Configuration
> • Snapshot Development & Deployment
> • Automation & Workflow Builds
> • AI-Powered Campaign Systems
> • Custom Integrations (Make.com, n8n, Zapier, Stripe, Twilio, webhooks)
> • Ongoing GHL Management Retainers
>
> If your GHL is half-built, half-broken, or fully off — we fix it.
> If it's working but you want AI layered in — we build it.
>
> Book a free 30-min discovery call: aixdesign.dev

### LinkedIn Personal (Terry) — headline 220 chars
> Founder, By Design AI · GHL + AI automations for agencies, coaches &
> service businesses · We design the system; it runs your business ·
> Book a free discovery call ↓

### YouTube — 1,000 chars (using ~500)
> By Design AI builds Go High Level + AI automation systems for agencies,
> coaches, and service businesses. On this channel: GHL teardowns,
> snapshot walkthroughs, AI workflow builds, and "watch me automate this"
> live builds.
>
> If your GHL is broken, half-built, or working but missing AI — start here.
>
> 🔗 Free 30-min discovery call → aixdesign.dev
> 📩 hello@aixdesign.dev

### Facebook Page — short description, 255 chars
> Go High Level specialist agency. GHL setup, snapshots, automations & AI
> campaign systems. We build the system — it runs your business. Free
> discovery call → aixdesign.dev

### GitHub — 160 chars
> By Design AI — GHL + AI automation agency. Snapshots, workflow specs &
> open scripts we use in client builds. aixdesign.dev

### Substack / Medium — 300 chars
> Field notes from a Go High Level specialist agency. GHL builds, AI
> workflows, automation teardowns, and the systems that quietly run small
> businesses. Written by Terry @ By Design AI.

### Email signature
```
Terry — Founder, By Design AI
GHL + AI automations, built by design.
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
`#gohighlevel` `#ghl` `#ghlsnapshot` `#ghlagency` `#marketingautomation`
`#aiautomation` `#smallbusinessautomation`

### Niche / rotation
`#makedotcom` `#n8n` `#zapier` `#crm` `#leadgen` `#salesfunnel`
`#localmarketing` `#agencyowner` `#coachingbusiness` `#realestatemarketing`

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

1. **Build in public** — "Here's the GHL workflow we shipped this week."
   Screenshots, Loom, 60-sec phone clip.
2. **Teardowns** — "What's wrong with this GHL setup." Roast a public
   funnel; show the fix.
3. **Primitives** — Reusable automations: snapshot of the week, "steal
   this workflow," n8n/Make recipe.
4. **Proof** — Client wins, before/after dashboards, retainer outcomes
   (with permission).

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
