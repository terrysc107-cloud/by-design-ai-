import fs from "fs";
import path from "path";
import { chromium } from "playwright";

/**
 * Renders the 1200x630 social card for /guide.
 *
 * The page was serving the portrait booklet shot (762x1000) as its og:image.
 * Every platform composes link previews at roughly 1.91:1, so a portrait image
 * is either cropped through the middle of the product or demoted to a small
 * square thumbnail. The card people actually see when the link is posted was
 * the one asset nobody had made.
 *
 * Uses the TRANSPARENT cutout rather than the parchment version, which is what
 * that variant is for: the card supplies its own dark ground, and compositing
 * the light backdrop into it would put a pale rectangle inside a dark card.
 */
const DIR = path.dirname(new URL(import.meta.url).pathname);
const booklet = fs.readFileSync(path.resolve(DIR, "../../public/guide-mockup.png")).toString("base64");

const doc = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap">
<style>
  html,body{margin:0;padding:0;}
  .card{width:1200px;height:630px;background:radial-gradient(circle at 85% 20%,rgba(115,215,243,.16),transparent 40%),#09111F;display:flex;align-items:center;
        font-family:Geist,system-ui,-apple-system,sans-serif;position:relative;overflow:hidden;}
  .rule{position:absolute;top:0;left:0;right:0;height:4px;
        background:linear-gradient(90deg,rgba(115,215,243,.25),#73D7F3 45%,#2878FF);}
  .left{width:470px;height:630px;display:flex;align-items:center;justify-content:center;}
  .left img{height:520px;display:block;}
  .right{flex:1;padding:0 64px 0 8px;display:flex;flex-direction:column;gap:20px;}
  .eyebrow{color:#73D7F3;font-size:15px;letter-spacing:4px;text-transform:uppercase;font-weight:600;margin:0;}
  h1{margin:0;color:#fff;font-size:62px;line-height:1.02;letter-spacing:-2px;font-weight:600;}
  p{margin:0;color:#AAB6C6;font-size:22px;line-height:1.45;max-width:520px;}
  .foot{margin-top:12px;display:flex;align-items:center;gap:14px;}
  .mark{font-size:20px;font-weight:600;color:#fff;letter-spacing:-.2px;}
  .mark span{color:#73D7F3;}
  .dot{width:4px;height:4px;background:rgba(115,215,243,.5);}
  .url{font-size:17px;color:rgba(170,182,198,.8);}
</style></head><body>
  <div class="card">
    <div class="rule"></div>
    <div class="left"><img src="data:image/png;base64,${booklet}" alt=""></div>
    <div class="right">
      <p class="eyebrow">Free guide</p>
      <h1>The Board<br>Method</h1>
      <p>Five steps to AI that runs your standing work on a schedule, instead of waiting for you to open it.</p>
      <div class="foot">
        <span class="mark">ai<span>x</span>design</span>
        <span class="dot"></span>
        <span class="url">aixdesign.dev/guide</span>
      </div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(doc, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const out = path.resolve(DIR, "../../public/guide-og.png");
await page.screenshot({ path: out });
await browser.close();
console.log("wrote", out, fs.statSync(out).size, "bytes");
