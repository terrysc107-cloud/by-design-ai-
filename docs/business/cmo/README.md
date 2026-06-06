# AI by Design — Content Engine (CMO)

Output folder for produced marketing content. The CEO drafts/produces here and in PRs; the Chairman
(or a VA, once the CEO is promoted) approves and publishes.

## What lives here
- `content-out/` — produced assets per piece (social images, repurposed clips, ad creative)
- Brand source assets are in the repo root: `public/brand/` (logos, banners, avatar, OG)

## How content gets made
1. **SEO is primary** — blog + programmatic pages ship as **PRs** in the Next.js app
   (`PLAYBOOKS/SEO-CONTENT.md`), not as files here.
2. **Social repurpose** — each article/page → ≥2 posts drafted to `ceo/CONTENT-QUEUE.md`, using
   `docs/BRAND-KIT.md §5/§9` and banners from `public/brand/`.
3. **Scheduling** — the brand-launch batch lives in `scripts/postiz-schedule.ts` (dry-run to review;
   Chairman runs `--live`). Future per-cycle batches follow the same pattern.

## Guardrails
Same as the CEO charter (`ceo/CHARTER.md §5`): no results/outcome claims we can't show · never lead
with a tool name · no client data without written permission · brand voice + no stock AI-brain imagery.

> Video pipeline (ElevenLabs/HeyGen/Playwright) is **not** set up here yet — SEO-first by decision.
> If you later want the SPD-style short-form video engine, it ports from `~/code/crcst/scripts/video-pipeline/`.
