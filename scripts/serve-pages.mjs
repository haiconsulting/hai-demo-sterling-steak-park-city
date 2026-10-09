// Serves out/ the way GitHub Pages does, under NEXT_PUBLIC_BASE_PATH:
// directory -> index.html, unknown path -> 404.html, nothing outside the base.
// Usage: NEXT_PUBLIC_BASE_PATH=/hai-demo-sterling-steak-park-city node scripts/serve-pages.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve("out");
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const port = Number(process.argv[2] ?? process.env.PORT ?? 4318);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

async function file(p) {
  try {
    const s = await stat(p);
    if (s.isDirectory()) return file(path.join(p, "index.html"));
    return p;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (base && url === base) {
    res.writeHead(301, { Location: `${base}/` }).end();
    return;
  }
  if (base && !url.startsWith(`${base}/`)) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end(`Not under ${base}/`);
    return;
  }
  const rel = url.slice(base.length);
  const target = path.join(root, rel);
  if (!target.startsWith(root)) return res.writeHead(403).end();
  let found = await file(target);
  if (found && (await stat(target)).isDirectory() && !url.endsWith("/")) {
    res.writeHead(301, { Location: `${url}/` }).end();
    return;
  }
  let status = 200;
  if (!found) {
    found = path.join(root, "404.html");
    status = 404;
  }
  let body = await readFile(found);
  const type = types[path.extname(found)] ?? "application/octet-stream";
  const compress = /text|javascript|json|xml|svg/.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  if (compress) body = gzipSync(body, { level: 9 });
  res.writeHead(status, {
    "Content-Type": type,
    ...(compress ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {}),
    "Cache-Control": rel.startsWith("/_next/static/") ? "public, max-age=31536000, immutable" : rel.startsWith("/img/") ? "public, max-age=86400" : "no-cache",
  });
  res.end(body);
}).listen(port, "0.0.0.0", () => {
  console.log(`Serving out/ at http://127.0.0.1:${port}${base}/`);
});
