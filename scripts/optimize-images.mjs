// Turns the raw photos in assets-src/ into responsive AVIF + WebP files in
// public/img/ and writes a manifest the <Photo> component reads. Run with
// `npm run images` after adding or replacing a photo; outputs are committed so
// the build itself never needs sharp.
import { mkdir, writeFile, rm, copyFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "assets-src";
const OUT = "public/img";

/** name -> [source file, target widths, optional crop aspect (w/h)] */
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
};

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const manifest = {};
for (const [name, [file, widths]] of Object.entries(jobs)) {
  const input = path.join(SRC, file);
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

// Social card: 1200x630 JPEG, which every scraper understands.
await sharp(path.join(SRC, "social_share.jpg"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(OUT, "og-sterling.jpg"));

// Icons
await copyFile(path.join(SRC, "apple-touch-icon.png"), "src/app/apple-icon.png");
await sharp(path.join(SRC, "apple-touch-icon.png")).resize(64, 64).png().toFile("src/app/icon.png");

await writeFile("src/data/images.generated.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Optimized ${Object.keys(manifest).length} images into ${OUT}/`);
