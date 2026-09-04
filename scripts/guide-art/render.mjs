import fs from "fs";
import path from "path";
import { chromium } from "playwright";

/**
 * Renders the guide's step illustrations as styled views of REAL board files.
 *
 * Deliberately not generated art. The guide's whole claim is that this system is
 * a folder of plain markdown you can read, so showing the actual artifact is
 * both more persuasive and more honest than an abstract illustration of a robot
 * at a desk. Every excerpt below is genuine content from a running board.
 */
// Each entry in `lines` is ONE rendered line, made of [class, text] segments.
// The first version made each segment its own entry, so segments belonging to
// the same line ran together and blank lines vanished.
const CARDS = [
  {
    slug: "01-charter",
    file: "ceo/CHARTER.md",
    lines: [
      [["c", "## 1. Identity"]],
      [],
      [["k", "Rank:"], ["v", " Operator"]],
      [["k", "Owns:"], ["v", " revenue truth. What came in, what is about to lapse,"]],
      [["v", "      what the month actually looks like."]],
      [],
      [["c", "## 2. Disposition"]],
      [],
      [["v", "A retention-first performance marketer. Kills formats and"]],
      [["v", "campaigns that do not perform, "], ["hl", "including her own favourites."]],
    ],
    caption: "Disposition is the line that decides close calls.",
  },
  {
    slug: "02-floor",
    file: "ceo/GOALS.md",
    lines: [
      [["c", "## This quarter"]],
      [],
      [["v", "- Revenue: "], ["hl", "floor $4,000/month"], ["v", ". Currently $2,600."]],
      [["v", "- Enquiries: "], ["hl", "floor 8/month"], ["v", ". Currently 4."]],
      [],
      [["c", "## What I am NOT doing this quarter"]],
      [],
      [["v", "- No new service lines. Depth over breadth until"]],
      [["v", "  revenue is stable."]],
    ],
    caption: "Floors, not targets. And what you ruled out.",
  },
  {
    slug: "03-run",
    file: "PLAYBOOKS/WEEKLY.md",
    lines: [
      [["c", "## Step 1 - Liveness check"]],
      [],
      [["v", "Is this playbook itself still running? Look at the newest"]],
      [["v", "file in BOARD-MEETINGS/. If it is more than 10 days old,"]],
      [["hl", "that gap is the headline"], ["v", ", not a footnote."]],
      [],
      [["v", "A scheduled system that dies silently is the most common"]],
      [["v", "failure in this whole design. Check."]],
    ],
    caption: "The schedule is half of it. Noticing it stopped is the other half.",
  },
  {
    slug: "04-review",
    file: "ceo/METRICS.md",
    lines: [
      [["c", "| Metric            | Value   | Where it came from     |"]],
      [["v", "|-------------------|---------|------------------------|"]],
      [["v", "| Paying students   | "], ["hl", "0"], ["v", "       | real Stripe payment    |"]],
      [["v", "| Comped / internal | 2       | owner + QA login       |"]],
      [["v", "| Website visits    | "], ["hl", "unknown"], ["v", " | no analytics yet       |"]],
      [],
      [["c", "## Notes and gaps"]],
      [["v", "No acquisition number exists at all. Largest gap here."]],
    ],
    caption: "Every number carries its source. Gaps are named, never filled.",
  },
  {
    slug: "05-promote",
    file: "ceo/PROMOTION-LADDER.md",
    lines: [
      [["c", "## L2 - Executive"]],
      [],
      [["v", "- [ ] 8 consecutive weekly reports, useful and accurate"]],
      [["v", "- [ ] Zero published numbers later found wrong"]],
      [["v", "- [ ] Zero guardrail violations"]],
      [],
      [["hl", "Status: 0 of 5. Not requesting L2."]],
      [["v", "One report on file against a bar of eight. This seat has"]],
      [["v", "not yet been wrong in public, which is not the same as"]],
      [["v", "being reliable."]],
    ],
    caption: "The seat asks. You grant. It cites its own record.",
  },
];

/**
 * DARK, since 2026-09-04.
 *
 * The card used to be cream (#fdfbf7) with the dark window floating on it. That
 * was built for the light /guide page, and it was fine there. Then the same
 * five renders went into the drip emails, which are dark, and a bright cream
 * slab in the middle of a dark email reads as a foreign object.
 *
 * The card is now #23201b, which is EXACTLY the email card's background, so in
 * email the illustration blends into the message with only the figure's gold
 * hairline defining it. On the light /guide page and the white PDF pages the
 * same image reads as a dark code screenshot, which is the normal treatment for
 * one. So all three surfaces get the right thing from a single render, rather
 * than a light set and a dark set to keep in sync.
 *
 * The window drops to #191712 so it still reads as inset against the card now
 * that the card is dark too.
 */
const TPL = (card) => `<!doctype html><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1376px;height:768px;background:#23201b;
 font-family:ui-sans-serif,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
 display:flex;align-items:center;justify-content:center;padding:64px}
.win{width:100%;background:#191712;border-radius:14px;overflow:hidden;
 border:1px solid rgba(201,168,76,.16);
 box-shadow:0 30px 80px rgba(0,0,0,.35)}
.bar{display:flex;align-items:center;gap:10px;padding:16px 22px;background:#221f19}
.dot{width:12px;height:12px;border-radius:50%}
.name{margin-left:12px;color:#a8a29e;font-size:17px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
pre{padding:34px 40px 40px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
 font-size:24px;line-height:1.62;color:#d6d3d1;white-space:pre-wrap}
.c{color:#c9a84c;font-weight:600}
.k{color:#a8a29e}
.hl{background:rgba(201,168,76,.20);color:#e7d9a8;border-radius:4px;padding:1px 5px}
.cap{margin-top:26px;text-align:center;color:#a8a29e;font-size:22px}
</style><body><div style="width:100%">
<div class="win">
 <div class="bar">
  <span class="dot" style="background:#f0665c"></span>
  <span class="dot" style="background:#f4bd4f"></span>
  <span class="dot" style="background:#61c554"></span>
  <span class="name">${card.file}</span>
 </div>
 <pre>${card.lines.map(line =>
   line.length === 0 ? "" :
   line.map(([cls, t]) => cls ? `<span class="${cls}">${t}</span>` : t).join("")
 ).join("\n")}</pre>
</div>
<p class="cap">${card.caption}</p>
</div></body>`;

const out = path.join(path.dirname(new URL(import.meta.url).pathname), "../../public/guide");
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1376, height: 768 } });
for (const card of CARDS) {
  await page.setContent(TPL(card), { waitUntil: "load" });
  const f = path.join(out, `${card.slug}.png`);
  await page.screenshot({ path: f });
  console.log("  public/guide/" + card.slug + ".png");
}
await browser.close();
console.log("\n5 step illustrations rendered from real board files.");
