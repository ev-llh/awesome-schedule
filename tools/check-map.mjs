// Keeps docs/MAP.md honest: every `@map:tag` in src/ must be listed in docs/MAP.md and vice-versa.
// Run: node tools/check-map.mjs   (also runs automatically inside tools/build.mjs)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const TAG = /@map:([a-z0-9-]+)/g;

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const tags = (text) => new Set([...text.matchAll(TAG)].map((m) => m[1]));

export function checkMap() {
  const inCode = new Map();
  for (const p of walk(join(root, 'src'))) {
    for (const t of tags(readFileSync(p, 'utf8'))) inCode.set(t, p.slice(root.length + 1));
  }
  const inMap = tags(readFileSync(join(root, 'docs/MAP.md'), 'utf8'));
  const missing = [...inCode.keys()].filter((t) => !inMap.has(t));
  const stale = [...inMap].filter((t) => !inCode.has(t));
  const problems = [
    ...missing.map((t) => `in code but not in docs/MAP.md: @map:${t}  (${inCode.get(t)})`),
    ...stale.map((t) => `in docs/MAP.md but not in code: @map:${t}`),
  ];
  return { problems, count: inCode.size };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { problems, count } = checkMap();
  if (problems.length) { console.error('MAP out of date:\n  ' + problems.join('\n  ')); process.exit(1); }
  console.log(`MAP ok — ${count} anchors in sync`);
}
