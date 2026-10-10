// Turns the raw photos in assets-src/ into responsive AVIF + WebP files in
// public/img/ and writes a manifest the <Photo> component reads. Run with
// `npm run images` after adding or replacing a photo; outputs are committed so
// the build itself never needs sharp. `npm run images -- logo-shield` redoes
// only the named images and keeps the rest.
import { mkdir, writeFile, rm, copyFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public/img";

/** name -> [source file, target widths, optional sharp extract region] */
const jobs = {
  hero: ["video_poster.jpg", [640, 960, 1440, 1920]],
  ribeye: ["social_share.jpg", [480, 800, 1200]],
  dining: ["events_left.png", [480, 726]],
  toast: ["parties_left.png", [480, 726]],
  "prime-rib": ["menu_right_new.png", [480, 833]],
  "plates": ["catering_right_new.png", [480, 748]],
  "house-band": ["gallery_1.jpg", [400, 800]],
  calamari: ["gallery_2.jpg", [400, 800]],
  cocktail: ["gallery_3.jpg", [400, 800]],
  "baked-potato": ["gallery_4.jpg", [400, 800]],
  "tuna": ["gallery_5.jpg", [400, 800]],
  bartender: ["gallery_6.jpg", [400, 800]],
  lounge: ["gallery_7.jpg", [400, 800]],
  oysters: ["gallery_8.jpg", [400, 800]],
  logo: ["logo_new.png", [146, 293]],
  // The shield alone (no tiny wordmark) for the header, where the full logo is too small to read.
  "logo-shield": ["logo_new.png", [56, 112, 168], { left: 0, top: 80, width: 293, height: 200 }],
  // /pitch before/after: scripts/capture-current-site.mjs and scripts/capture-demo-site.mjs
  "pitch-current-desktop": ["pitch/current-desktop.png", [720, 1200]],
  "pitch-demo-desktop": ["pitch/demo-desktop.png", [720, 1200]],
  "pitch-current-mobile": ["pitch/current-mobile.png", [260, 390, 520]],
  "pitch-demo-mobile": ["pitch/demo-mobile.png", [260, 390, 520]],
};

const only = process.argv.slice(2);
const MANIFEST = "src/data/images.generated.json";
let manifest = {};
if (only.length) {
  manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
  for (const f of await readdir(OUT)) if (only.some((n) => f.startsWith(`${n}-`))) await rm(path.join(OUT, f));
} else {
  await rm(OUT, { recursive: true, force: true });
}
await mkdir(OUT, { recursive: true });

for (const [name, [file, widths, extract]] of Object.entries(jobs)) {
  if (only.length && !only.includes(name)) continue;
  const input = extract
    ? await sharp(await sharp(path.join(SRC, file)).extract(extract).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer()
    : path.join(SRC, file);
  const meta = await sharp(input).metadata();
  const alpha = Boolean(meta.hasAlpha) || meta.channels === 4 || file.endsWith(".png");
  const usable = widths.filter((w) => w <= meta.width);
  for (const w of usable) {
    const base = sharp(input).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await base.clone().webp({ quality: 74, alphaQuality: 90 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  manifest[name] = { width: meta.width, height: meta.height, widths: usable, alpha };
}

if (only.length) {
  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Optimized ${only.join(", ")}`);
  process.exit(0);
}

// Social card: 1200x630 JPEG, which every scraper understands.
await sharp(path.join(SRC, "social_share.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(OUT, "og-sterling.jpg"));

// Icons
await copyFile(path.join(SRC, "apple-touch-icon.png"), "src/app/apple-icon.png");
await sharp(path.join(SRC, "apple-touch-icon.png")).resize(64, 64).png().toFile("src/app/icon.png");

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Optimized ${Object.keys(manifest).length} images into ${OUT}/`);
