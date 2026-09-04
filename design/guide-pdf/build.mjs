import fs from "fs";
import path from "path";

/**
 * Emits the five step artboards for The Board Method PDF.
 *
 * Generated rather than hand-written because the five pages are the same page
 * five times, and five near-identical hand-maintained files drift: a spacing
 * fix lands on three of them and nobody notices until it is printed. The copy
 * below is the same copy as app/guide/page.tsx.
 *
 * A4 at 96 css px per inch = 794 x 1123, which is what canvas.json frames and
 * what Export PDF treats as one page at natural size.
 */
const OUT = path.dirname(new URL(import.meta.url).pathname);

const GOLD = "#C9A84C";
const INK = "#18181B";
const MUTED = "#52525B";
const FAINT = "#71717A";
const RULE = "#E4E4E7";

const STEPS = [
  {
    num: "01", slug: "Charter", img: "01-charter.jpg",
    title: "Charter",
    lede: "A prompt is what you ask this time. A charter is who the seat is.",
    problem: "Most people write a prompt, so every session starts from zero: you re-explain your business, it produces something generic, and nothing accumulates. A charter is a file the seat reads before every single run.",
    symptom: "You find yourself re-explaining your business at the start of every conversation.",
    fix: "One file, five sections: identity (what this seat owns), disposition (how it decides when two reasonable options conflict), mandate (three to five things it is for), guardrails (what it must never claim and never do), and cadence (when it runs). The disposition line does the most work and is the one people skip.",
    takeaway: "Write the disposition line first, and make it name something the seat will refuse or kill, including things it would otherwise prefer. “Thoughtful and strategic” describes nobody. “Kills campaigns that do not perform, including her own favourites” changes what it does.",
    caption: "Disposition is the line that decides close calls.",
  },
  {
    num: "02", slug: "Floor", img: "02-floor.jpg",
    title: "Floor",
    lede: "A target is a ceiling. A floor is a line you can be under.",
    problem: "A target is a thing to reach, so it quietly becomes the number where attention stops. It also gives your seat nothing useful to say, because “you are at 68% of target” describes arithmetic rather than a situation.",
    symptom: "Your AI tells you things look broadly fine. Every week. Regardless of the week.",
    fix: "Rewrite every goal as a minimum acceptable outcome. Not the aspiration, the number below which the month went badly. Then instruct the seat to report distance to the floor and whether it will clear it, never percent to target.",
    takeaway: "If your assistant has never flagged anything, it almost certainly has no floors to measure against. Nothing can be off track when there is no line to be under. That is a ten-minute fix.",
    caption: "A floor is a number the month can fall below.",
  },
  {
    num: "03", slug: "Run", img: "03-run.jpg",
    title: "Run",
    lede: "Nothing happens on a day you do not sit down.",
    problem: "Everything most people do with AI is initiated by them. You decide there is work, you open a chat, you supply the context. The ceiling is your attention.",
    symptom: "Last week nothing happened, because you were busy doing the work.",
    fix: "One standing run against durable files, on a schedule. Start with a single daily or weekly job that reads your goals and numbers and tells you what changed and what is off its floor. Add a liveness check, because scheduled work dies silently and the failure is invisible.",
    takeaway: "Schedule exactly one run this week, then diary a reminder to confirm it actually fired. A schedule nobody verifies is a schedule that stops without telling you.",
    caption: "A run that nobody verifies is a run that can stop.",
  },
  {
    num: "04", slug: "Review", img: "04-review.jpg",
    title: "Review",
    lede: "Articulate is free. A plausible number looks exactly like a real one.",
    problem: "Your board will produce something articulate every time. The failure mode is not gibberish, it is a confident, well-written paragraph that could be about any business and quietly is not about yours.",
    symptom: "You cannot tell which parts of the answer came from your actual numbers.",
    fix: "Four checks, under a minute. Does every claim trace to a number in your files? Did it name what it did not have, rather than filling the gap? Is it consistent with decisions you already made? Could you act on it today?",
    takeaway: "Grade your most recent output against those four. The one that usually fails is the second, and the fix is one line in the brief: if a number you need is missing, say it is missing, do not estimate it.",
    caption: "Every claim should trace back to a file you can open.",
  },
  {
    num: "05", slug: "Promote", img: "05-promote.jpg",
    title: "Promote",
    lede: "Autonomy is a ladder, not a switch.",
    problem: "Autonomy gets treated as a switch. Either you approve everything, which means the work only happens while you watch, or you turn approvals off and hope. The real question is never whether you trust it. It is which specific actions it has earned.",
    symptom: "You are either approving every single action, or you stopped looking a while ago.",
    fix: "Four ranks, each naming what it unlocks and what stays gated. The seat requests a promotion citing its own decision log; you grant or hold; promotions are revocable. Some decisions never move at any rank, and writing that down is what makes the rest safe to climb.",
    takeaway: "Write down what your assistant may do today without asking, and one thing it must earn the right to do. That single sentence is the beginning of a ladder.",
    caption: "Promotions are requested, granted, and revocable.",
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const page = (s, i) => `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap">
  <style>
    body { margin: 0; font-family: Geist, system-ui, -apple-system, "Segoe UI", sans-serif; }
    a { color: #8A6D1F; } a:hover { color: #6B540F; }
  </style>
</helmet>
<div style="width: 794px; height: 1123px; background: #FFFFFF; color: ${INK}; display: flex; flex-direction: column; padding: 60px 64px 44px; box-sizing: border-box;">

  <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1px solid ${RULE}; padding-bottom: 14px;">
    <span style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${FAINT}; font-weight: 500;">The Board Method</span>
    <span style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: ${FAINT}; font-weight: 500;">Step ${s.num} of 05</span>
  </div>

  <div style="display: flex; align-items: flex-start; gap: 20px; margin-top: 30px;">
    <span style="font-size: 46px; font-weight: 700; color: ${GOLD}; line-height: 1; letter-spacing: -1px;">${s.num}</span>
    <div style="display: flex; flex-direction: column; gap: 8px; padding-top: 2px;">
      <h1 style="margin: 0; font-size: 40px; font-weight: 600; letter-spacing: -1px; line-height: 1;">${esc(s.title)}</h1>
      <p style="margin: 0; font-size: 17px; line-height: 1.4; color: ${MUTED}; max-width: 520px;">${esc(s.lede)}</p>
    </div>
  </div>

  <p style="margin: 26px 0 0; font-size: 16px; line-height: 1.62; color: ${INK};">${esc(s.problem)}</p>

  <div style="margin-top: 22px; border-left: 3px solid ${GOLD}; background: rgba(201,168,76,0.09); padding: 16px 20px;">
    <div style="font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #8A6D1F; font-weight: 600; margin-bottom: 6px;">The symptom</div>
    <div style="font-size: 16px; line-height: 1.5; color: ${INK};">${esc(s.symptom)}</div>
  </div>

  <p style="margin: 22px 0 0; font-size: 16px; line-height: 1.62; color: ${INK};">${esc(s.fix)}</p>

  <div style="margin-top: 24px;">
    <img src="${s.img}" alt="${esc(s.caption)}" style="width: 100%; display: block; border: 1px solid ${RULE};">
  </div>

  <div style="margin-top: auto; padding-top: 22px; border-top: 1px solid ${RULE}; display: flex; flex-direction: column; gap: 8px;">
    <div style="font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: ${GOLD}; font-weight: 600;">Do this today</div>
    <p style="margin: 0; font-size: 15px; line-height: 1.55; color: ${INK};">${esc(s.takeaway)}</p>
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px;">
      <span style="font-size: 11px; color: ${FAINT};">AI by Design &middot; aixdesign.dev</span>
      <span style="font-size: 11px; color: ${FAINT};">${i + 2}</span>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
`;

for (const [i, s] of STEPS.entries()) {
  const f = path.join(OUT, `Step${s.num}${s.slug}.dc.html`);
  fs.writeFileSync(f, page(s, i));
  console.log("  " + path.basename(f));
}
