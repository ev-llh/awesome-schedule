// Build: src/ + assets/fonts/dailybrush-subset.woff2  ->  dist/daily-brush.html  (one self-contained offline file)
// Run: node tools/build.mjs      No dependencies, Node >= 18.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkMap } from './check-map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const files = (dir, ext) => readdirSync(join(root, dir)).filter((f) => f.endsWith(ext)).sort().map((f) => read(`${dir}/${f}`));

const { problems } = checkMap();
if (problems.length) { console.error('MAP out of date (fix docs/MAP.md):\n  ' + problems.join('\n  ')); process.exit(1); }

const font = readFileSync(join(root, 'assets/fonts/dailybrush-subset.woff2')).toString('base64');
const fontFace = `@font-face{font-family:"DailyBrush";font-weight:400;font-style:normal;font-display:swap;unicode-range:U+2E80-2FDF,U+3000-303F,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FF00-FFEF;src:url(data:font/woff2;base64,${font}) format("woff2")}`;
const css = files('src/css', '.css').join('\n');
const js = `(()=>{'use strict';\n${files('src/js', '.js').join('\n')}\n})();`;

// split/join (not String.replace) so "$" in the payload is never treated as a replacement pattern
const html = read('src/index.template.html')
  .split('{{FONT_FACE}}').join(fontFace)
  .split('{{CSS}}').join(css)
  .split('{{ART}}').join(read('src/art.svg'))
  .split('{{JS}}').join(js);

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/daily-brush.html'), html);
console.log(`built dist/daily-brush.html  ${(html.length / 1024).toFixed(0)} KiB`);
