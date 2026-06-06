# Playbook — Content PR

> How the CEO opens a content/site PR at L1. The CEO writes the change; the Chairman reviews + merges.
> Keep PRs small, single-purpose, and safe to ship.

## When to open a PR
- A new blog article or programmatic landing page (`SEO-CONTENT.md`).
- A site copy / SEO / metadata improvement.
- A new lead-magnet asset or page section that lifts conversion.

## Steps
1. **Branch** off the default branch: `content/{short-slug}`.
2. **Build the change** in the Next.js app:
   - Blog/article → an MDX/route under the blog hub; set `metadata` (title, description, canonical,
     `openGraph`); add to `app/sitemap.ts`.
   - Programmatic page → reuse the shared template/component; set per-page metadata + sitemap entry.
3. **Self-check against guardrails** (`CHARTER.md §5`):
   - [ ] No results/outcome claims we can't show.
   - [ ] Doesn't lead with a tool name (problem/outcome first).
   - [ ] Brand voice (`BRAND-KIT.md §2`); no banned words; no stock AI-brain imagery.
   - [ ] No real client data without written permission.
   - [ ] One clear discovery-call CTA; internal links sensible; canonical + sitemap set.
4. **Verify** locally: `npm run build` passes; `npx tsc --noEmit` clean; new route renders.
5. **Open the PR** with a tight description: what, why, the target keyword/intent, and the OKR it serves.
6. **Log it** in `DECISION-LOG.md` (Type: Content) and update OKR status.

## What NOT to do at L1
- Don't merge your own PR (Chairman merges).
- Don't deploy, spend, send email, or post externally.
- Don't touch pricing, offers, or anything client-facing without a Chairman approval logged first.
