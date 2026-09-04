import fs from "fs";
import path from "path";
import { chromium } from "playwright";

/**
 * Renders the seven artboards into public/guide.pdf.
 *
 * The canvas can export a PDF by hand, but the file the FUNNEL serves is
 * public/guide.pdf: guideEmail() links GUIDE_PDF_URL there the moment somebody
 * signs up. Until this script existed that file was the June lead magnet, "10
 * Things In Your Business You Should Never Do Manually", so every new
 * subscriber was promised The Board Method and sent something else entirely.
 * A manual export step is the kind of thing that silently does not happen.
 *
 * Reads the same .dc.html artboards the canvas uses, so the PDF and the canvas
 * cannot say different things. The artboards are static (no holes, no logic),
 * so stripping the Design Component wrapper leaves plain renderable HTML.
 */
const DIR = path.dirname(new URL(import.meta.url).pathname);
const ORDER = [
  "Main.dc.html",
  "Step01Charter.dc.html", "Step02Floor.dc.html", "Step03Run.dc.html",
  "Step04Review.dc.html", "Step05Promote.dc.html",
  "NextSteps.dc.html",
];

const IMG_DIR = process.env.IMG_DIR;
const imgCache = new Map();
function inlineImages(html) {
  return html.replace(/src="([^"]+\.jpg)"/g, (m, file) => {
    if (!imgCache.has(file)) {
      const p = path.join(IMG_DIR, file);
      imgCache.set(file, `data:image/jpeg;base64,${fs.readFileSync(p).toString("base64")}`);
    }
    return `src="${imgCache.get(file)}"`;
  });
}

let head = "";
const bodies = ORDER.map((f, i) => {
  const raw = fs.readFileSync(path.join(DIR, f), "utf8");
  if (i === 0) {
    const helmet = raw.match(/<helmet>([\s\S]*?)<\/helmet>/);
    head = helmet ? helmet[1] : "";
  }
  let body = raw
    .replace(/[\s\S]*?<x-dc>/, "")
    .replace(/<\/x-dc>[\s\S]*/, "")
    .replace(/<helmet>[\s\S]*?<\/helmet>/, "")
    .trim();
  return inlineImages(body);
});

const doc = `<!doctype html><html><head><meta charset="utf-8">${head}
<style>
  @page { size: 794px 1123px; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  .pg { width: 794px; height: 1123px; overflow: hidden; page-break-after: always; break-after: page; }
  .pg:last-child { page-break-after: auto; break-after: auto; }
</style></head><body>
${bodies.map((b) => `<div class="pg">${b}</div>`).join("\n")}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(doc, { waitUntil: "networkidle" });
await page.waitForTimeout(1200); // webfont settle
const out = path.resolve(DIR, "../../public/guide.pdf");
await page.pdf({ path: out, width: "794px", height: "1123px", printBackground: true, pageRanges: "1-7" });
await browser.close();
console.log("wrote", out, fs.statSync(out).size, "bytes");
