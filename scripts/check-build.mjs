import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const option = name => process.argv[process.argv.indexOf(name) + 1];
const base = process.argv.includes("--base") ? option("--base") : "/";
const origin = process.argv.includes("--origin") ? option("--origin") : "http://127.0.0.1:4173";
assert.ok(base.startsWith("/") && base.endsWith("/"), "Base must start and end with a slash");
const root = path.resolve("dist");
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(filename);
    else files.push(path.relative(root, filename).replaceAll("\\", "/"));
  }
}
await walk(root);
assert.ok(files.includes("index.html"));
assert.ok(files.includes("images/roadway-sample.svg"));
assert.ok(files.includes("favicon.svg"));
let references = 0;
for (const filename of files.filter(f => /\.(html|css|js)$/.test(f))) {
  const text = await readFile(path.join(root, filename), "utf8");
  const patterns = filename.endsWith(".html") ? [/(?:src|href)="([^"]+)"/g]
    : filename.endsWith(".css") ? [/url\(["']?([^"')]+)["']?\)/g]
    : [/(?:from|import)\s*["'](\.[^"']+)["']/g, /import\(["'](\.[^"']+)["']\)/g];
  for (const pattern of patterns) for (const match of text.matchAll(pattern)) {
    const reference = match[1];
    if (/^(data:|https?:|#)/.test(reference)) continue;
    const url = new URL(reference, `${origin}${base}${filename}`);
    assert.ok(url.pathname.startsWith(base), `Reference escaped deployment base: ${reference}`);
    const local = decodeURIComponent(url.pathname.slice(base.length));
    assert.ok(files.includes(local), `Missing referenced asset: ${filename} → ${reference}`);
    references++;
  }
}
const responses = await Promise.all(files.filter(f => /\.(html|css|js|svg|woff2?)$/.test(f)).map(async filename => {
  const url = `${origin}${base}${filename}`;
  const response = await fetch(url);
  assert.equal(response.status, 200, `${url} did not return 200`);
  const served = Buffer.from(await response.arrayBuffer());
  const expected = await readFile(path.join(root, filename));
  assert.ok(served.equals(expected), `${url} returned different content (possibly an HTML fallback)`);
  return filename;
}));
console.log(`Verified ${references} local asset references and ${responses.length} exact HTTP responses under ${base}`);
