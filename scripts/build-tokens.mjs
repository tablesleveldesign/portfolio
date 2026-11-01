// Builds src/styles/tokens.css from tokens/tokens.json, and refuses to build
// if any declared text/background pair fails its contrast minimum.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { checkContrast, toCss } from '../tokens/lib.mjs';

const tokens = JSON.parse(await readFile(new URL('../tokens/tokens.json', import.meta.url), 'utf8'));

const failures = checkContrast(tokens).filter((r) => !r.pass);
if (failures.length) {
  for (const f of failures) {
    console.error(`Contrast fail (${f.theme}): ${f.fg} on ${f.bg} is ${f.ratio.toFixed(2)}, needs ${f.min}`);
  }
  process.exit(1);
}

const out = new URL('../src/styles/tokens.css', import.meta.url);
await mkdir(new URL('.', out), { recursive: true });
await writeFile(out, toCss(tokens));
console.log('tokens: wrote src/styles/tokens.css');
