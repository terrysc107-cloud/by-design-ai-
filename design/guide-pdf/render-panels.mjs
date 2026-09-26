import fs from "fs";
import path from "path";
import { chromium } from "playwright";

/**
 * Renders the five board-file panels used by the guide, in the site palette
 * (ink #09111F, blue #2878FF, cyan #73D7F3, silver #E3EAF3).
 *
 * Until 2026-09-26 these were screenshots in the old espresso/gold brand, kept
 * outside the repo (render-pdf.mjs read them from IMG_DIR). They are file
 * excerpts, so they are drawn here as text instead: sharp at any size, and the
 * source lives next to the pages that use them.
 *
 * Writes public/guide/NN-*.png (the /guide page and /guide/read) and
 * design/guide-pdf/panels/NN-*.jpg (inlined by render-pdf.mjs; run it with
 * IMG_DIR=design/guide-pdf/panels).
 */
const DIR = path.dirname(new URL(import.meta.url).pathname);
const PUB = path.resolve(DIR, "../../public/guide");
const JPG = path.join(DIR, "panels");

// Line syntax: "## x" heading, "~x~" highlight, "Label: x" muted label, "" blank.
const PANELS = [
  {
    slug: "01-charter", file: "ceo/CHARTER.md",
    caption: "Disposition is the line that decides close calls.",
    lines: ["## 1. Identity", "", "Rank: Operator", "Owns: revenue truth. What came in, what is about to lapse,", "      what the month actually looks like.", "", "## 2. Disposition", "", "A retention-first performance marketer. Kills formats and", "campaigns that do not perform, ~including her own favourites.~"],
  },
  {
    slug: "02-floor", file: "ceo/GOALS.md",
    caption: "Floors, not targets. And what you ruled out.",
    lines: ["## This quarter", "", "- Revenue: ~floor $4,000/month~. Currently $2,600.", "- Enquiries: ~floor 8/month~. Currently 4.", "", "## What I am NOT doing this quarter", "", "- No new service lines. Depth over breadth until", "  revenue is stable."],
  },
  {
    slug: "03-run", file: "PLAYBOOKS/WEEKLY.md",
    caption: "The schedule is half of it. Noticing it stopped is the other half.",
    lines: ["## Step 1 - Liveness check", "", "Is this playbook itself still running? Look at the newest", "file in BOARD-MEETINGS/. If it is more than 10 days old,", "~that gap is the headline~, not a footnote.", "", "A scheduled system that dies silently is the most common", "failure in this whole design. Check."],
  },
  {
    slug: "04-review", file: "ceo/METRICS.md",
    caption: "Every number carries its source. Gaps are named, never filled.",
    lines: ["## | Metric            | Value   | Where it came from     |", "|-------------------|---------|------------------------|", "| Paying students   | ~0~       | real Stripe payment    |", "| Comped / internal | 2       | owner + QA login       |", "| Website visits    | ~unknown~ | no analytics yet       |", "", "## Notes and gaps", "No acquisition number exists at all. Largest gap here."],
  },
  {
    slug: "05-promote", file: "ceo/PROMOTION-LADDER.md",
    caption: "The seat asks. You grant. It cites its own record.",
    lines: ["## L2 - Executive", "", "- [ ] 8 consecutive weekly reports, useful and accurate", "- [ ] Zero published numbers later found wrong", "- [ ] Zero guardrail violations", "", "~Status: 0 of 5. Not requesting L2.~", "One report on file against a bar of eight. This seat has", "not yet been wrong in public, which is not the same as", "being reliable."],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
function line(raw) {
  if (raw === "") return '<div class="l">&nbsp;</div>';
  if (raw.startsWith("## ")) return `<div class="l h">${esc(raw.startsWith("## |") ? raw.slice(3) : raw)}</div>`;
  let html = esc(raw).replace(/~([^~]+)~/g, '<mark>$1</mark>');
  html = html.replace(/^(Rank:|Owns:)/, '<span class="m">$1</span>');
  return `<div class="l">${html}</div>`;
}

const page = (p) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0}
  body{width:1376px;height:768px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;
    background:radial-gradient(circle at 78% 22%,rgba(115,215,243,.22),transparent 34%),linear-gradient(145deg,#fff 0%,#f4f7fb 48%,#e6edf6 100%);
    font-family:Arial,Helvetica,sans-serif}
  .panel{width:1248px;border-radius:26px;overflow:hidden;background:#0b1424;border:1px solid rgba(255,255,255,.7);
    box-shadow:0 34px 90px rgba(20,42,71,.22),0 0 0 1px rgba(9,17,31,.06)}
  .bar{height:54px;display:flex;align-items:center;gap:10px;padding:0 26px;background:#101c31;border-bottom:1px solid rgba(115,215,243,.12)}
  .bar i{width:12px;height:12px;border-radius:50%;background:#2d3b52}
  .bar i:first-child{background:#73d7f3}
  .bar span{margin-left:14px;color:#8ea0b8;font:500 17px "SF Mono",Menlo,monospace}
  .code{padding:40px 44px 46px;font:400 24px/1.62 "SF Mono",Menlo,monospace;color:#e6edf6;white-space:pre}
  .h{color:#73d7f3;font-weight:700}
  .m{color:#8ea0b8}
  mark{background:rgba(40,120,255,.28);color:#d8ecff;border-radius:3px;padding:0;box-shadow:0 0 0 5px rgba(40,120,255,.28)}
  p{margin:0;color:#526071;font-size:21px;letter-spacing:-.01em}
</style></head><body>
  <div class="panel"><div class="bar"><i></i><i></i><i></i><span>${esc(p.file)}</span></div>
  <div class="code">${p.lines.map(line).join("")}</div></div>
  <p>${esc(p.caption)}</p>
</body></html>`;

fs.mkdirSync(JPG, { recursive: true });
const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1376, height: 768 } });
for (const p of PANELS) {
  await tab.setContent(page(p), { waitUntil: "load" });
  await tab.screenshot({ path: path.join(PUB, `${p.slug}.png`) });
  await tab.screenshot({ path: path.join(JPG, `${p.slug}.jpg`), type: "jpeg", quality: 90 });
  console.log("panel", p.slug);
}
await browser.close();
