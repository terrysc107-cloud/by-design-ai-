import fs from "fs";
import path from "path";
import { chromium } from "playwright";

/**
 * Renders the PDF's actual cover to public/guide-cover.png.
 *
 * ASSETS.guideCover pointed at a Higgsfield CDN image generated on 2026-05-26:
 * the cover of "10 Things In Your Business You Should Never Do Manually". The
 * homepage lead-magnet section and the exit-intent modal both showed it, so
 * both were picturing a guide that no longer exists next to copy for one that
 * does.
 *
 * Rendered from Main.dc.html rather than generated, for the same reason the
 * step illustrations are real board files: this IS the cover of the PDF they
 * receive, so the picture and the download cannot disagree. It is also local
 * rather than a CDN URL, so it cannot rot when someone cleans up a generation
 * history.
 */
const DIR = path.dirname(new URL(import.meta.url).pathname);
const raw = fs.readFileSync(path.join(DIR, "Main.dc.html"), "utf8");
const head = (raw.match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ""])[1];
const body = raw
  .replace(/[\s\S]*?<x-dc>/, "")
  .replace(/<\/x-dc>[\s\S]*/, "")
  .replace(/<helmet>[\s\S]*?<\/helmet>/, "")
  .trim();

const doc = `<!doctype html><html><head><meta charset="utf-8">${head}
<style>html,body{margin:0;padding:0;background:#09111F;}</style>
</head><body>${body}</body></html>`;

const browser = await chromium.launch();
// 1.5x: crisp in the hero card without a 1MB gradient PNG.
const page = await browser.newPage({
  viewport: { width: 794, height: 1123 },
  deviceScaleFactor: 1.5,
});
await page.setContent(doc, { waitUntil: "networkidle" });
await page.waitForTimeout(1200); // webfont settle
const out = path.resolve(DIR, "../../public/guide-cover.png");
await page.screenshot({ path: out });
await browser.close();
console.log("wrote", out, fs.statSync(out).size, "bytes");
