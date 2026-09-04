import fs from "fs";
import path from "path";
import { chromium } from "playwright";

/**
 * Renders the cover as a 3D booklet mockup for the website.
 *
 * The site showed the flat cover in a thin border, so it read as words on a
 * black rectangle rather than something you receive. A lead magnet has to look
 * like an object before anyone believes it is worth an email address.
 *
 * CSS PERSPECTIVE, NOT A GENERATED IMAGE. An image model would render the
 * cover's type as mush, and the whole point of the cover is that it is
 * legible: the title, the four filenames and the five step names all have to
 * survive. This composites the REAL cover render, so the mockup and the PDF
 * cannot drift apart, and it costs nothing per run.
 *
 * Transparent background, so it drops onto the dark site and the dark email
 * without a seam.
 */
const DIR = path.dirname(new URL(import.meta.url).pathname);
const cover = fs.readFileSync(path.resolve(DIR, "../../public/guide-cover.png")).toString("base64");

const doc = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent;}
  .stage{width:900px;height:1180px;display:flex;align-items:center;justify-content:center;
         perspective:2200px;perspective-origin:60% 50%;}
  .book{position:relative;transform:rotateY(-21deg) rotateX(3deg) rotateZ(-1deg);
        transform-style:preserve-3d;}
  /* The page block, sitting behind and to the right, is what reads as thickness. */
  .pages{position:absolute;top:6px;left:10px;width:520px;height:736px;
         background:linear-gradient(90deg,#3a352c 0%,#cfc7b4 6%,#efe9dc 40%,#d8d0be 100%);
         transform:translateZ(-15px);}
  .cover{position:relative;width:520px;height:736px;display:block;
         box-shadow:0 2px 0 rgba(255,255,255,.05) inset;}
  /* Spine: a darker gradient down the binding edge, plus the gold hairline the
     brand uses everywhere else. */
  .spine{position:absolute;top:0;left:0;width:26px;height:736px;
         background:linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,.18) 60%,rgba(0,0,0,0));}
  .spine-rule{position:absolute;top:0;left:26px;width:1px;height:736px;
              background:rgba(201,168,76,.35);}
  .sheen{position:absolute;inset:0;pointer-events:none;
         background:linear-gradient(105deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 34%);}
  .shadow{position:absolute;left:34px;top:706px;width:500px;height:46px;
          background:radial-gradient(ellipse at center,rgba(0,0,0,.55),transparent 70%);
          filter:blur(16px);transform:translateZ(-30px);}
</style></head><body>
  <div class="stage">
    <div class="book">
      <div class="shadow"></div>
      <div class="pages"></div>
      <img class="cover" src="data:image/png;base64,${cover}" alt="" />
      <div class="spine"></div>
      <div class="spine-rule"></div>
      <div class="sheen"></div>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 900, height: 1180 },
  deviceScaleFactor: 2,
});
await page.setContent(doc, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const out = path.resolve(DIR, "../../public/guide-mockup.png");
await page.screenshot({ path: out, omitBackground: true });
await browser.close();
console.log("wrote", out, fs.statSync(out).size, "bytes");
