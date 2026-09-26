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

/**
 * Two variants from one composite.
 *
 * `transparent` drops onto any surface. `light` bakes in a warm studio
 * backdrop, which is what the site actually uses: the booklet is a dark object
 * and the site is a dark page, so on transparency it sat quietly instead of
 * reading as a product. A contained warm panel behind it is a photography
 * backdrop rather than a theme flip, so the page stays dark while the object
 * pops off it. It is also the version that works dropped straight into a social
 * post, where there is no dark page to sit on.
 */
const VARIANTS = [
  { name: 'guide-mockup.png', bg: 'transparent', omitBackground: true },
  {
    name: 'guide-mockup-light.png',
    bg: 'radial-gradient(ellipse 85% 70% at 50% 42%, #f7f9fc 0%, #e3eaf3 55%, #cfd9e6 100%)',
    omitBackground: false,
  },
]

const docFor = (bg) => `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:${bg};}
  .stage{width:900px;height:1180px;display:flex;align-items:center;justify-content:center;
         perspective:2200px;perspective-origin:60% 50%;}
  .book{position:relative;transform:rotateY(-21deg) rotateX(3deg) rotateZ(-1deg);
        transform-style:preserve-3d;}
  /* The page block, sitting behind and to the right, is what reads as thickness. */
  .pages{position:absolute;top:6px;left:10px;width:520px;height:736px;
         background:linear-gradient(90deg,#1a2536 0%,#c9d3e0 6%,#eef2f7 40%,#d3dbe6 100%);
         transform:translateZ(-15px);}
  .cover{position:relative;width:520px;height:736px;display:block;
         box-shadow:0 2px 0 rgba(255,255,255,.05) inset;}
  /* Spine: a darker gradient down the binding edge, plus the gold hairline the
     brand uses everywhere else. */
  .spine{position:absolute;top:0;left:0;width:26px;height:736px;
         background:linear-gradient(90deg,rgba(0,0,0,.62),rgba(0,0,0,.18) 60%,rgba(0,0,0,0));}
  .spine-rule{position:absolute;top:0;left:26px;width:1px;height:736px;
              background:rgba(115,215,243,.35);}
  .sheen{position:absolute;inset:0;pointer-events:none;
         background:linear-gradient(105deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 34%);}
  .shadow{position:absolute;left:22px;top:700px;width:530px;height:64px;
          background:radial-gradient(ellipse at center,rgba(20,42,71,.45),transparent 72%);
          filter:blur(22px);transform:translateZ(-30px);}
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
for (const v of VARIANTS) {
  await page.setContent(docFor(v.bg), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const out = path.resolve(DIR, `../../public/${v.name}`);
  await page.screenshot({ path: out, omitBackground: v.omitBackground });
  console.log("wrote", out, fs.statSync(out).size, "bytes");
}
await browser.close();
