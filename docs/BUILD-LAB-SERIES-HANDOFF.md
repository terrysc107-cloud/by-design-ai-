# Build Lab series integration

The full product and launch handoff is in the companion `micro-course-saas-template` repository: `docs/build-lab/CLAUDE-HANDOFF.md`.

This branch updates education referrals to the new four-week foundation-first Build Lab series. The course platform now owns actual cohort dates, tuition, capacity, applications, enrollment, questionnaires, personalized reviewed plans, and weekly work. Parent marketing does not mirror live price or seat inventory.

The earlier founding-run page and records are preserved in the course repository under `/build-lab/legacy`. Check existing paid customers before changing any live offer.

## Framework maintenance

The original Next.js 14.2.29 had published security advisories. The parent site was upgraded to Next.js 15.5.24 with React 19.2.4 and matching React type definitions. The official `next-async-request-api` codemod updated the blog page's dynamic params and metadata function. Runtime dependency patches are captured in the lockfile. A targeted override upgrades Next 15’s pinned PostCSS to 8.5.28. The final production audit reports zero vulnerabilities; the build, claim checks, and 43 existing voice-agent tests pass. Browser and connected-service verification remain. See the course handoff's verification record for final build/audit results.

References:

- https://nextjs.org/docs/app/guides/upgrading/version-15
- https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4

The course repository was updated within its existing major line to Next.js 16.3.6. Test the parent education pages, blog rendering, existing intake/voice-agent flows, and automated publishing in staging after importing this patch. No connected cron job, email delivery, database, or production deployment was exercised here.

## Local checks

```sh
npm ci
npm run check:claims
npm run build
npm audit --omit=dev
```

The claim check uses the local `tsx` dependency through Node. It no longer downloads a runner on each invocation.

Deploy the course preview first, then verify these education links against that preview. Keep the existing production domains and account connections. Do not replace the existing course product, Stripe price, or old cohort records.
