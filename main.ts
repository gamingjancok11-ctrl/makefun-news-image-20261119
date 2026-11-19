// Entry point for the make.fun news-image-20261119 bounty.
// Copies the pre-rendered entry.png to the output directory.
// Node 22 stdlib only. Run: MAKEFUN_OUTPUT_DIR=out node main.ts
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const dest = join(outDir, 'entry.png');

if (!existsSync(src)) {
  console.error('entry.png not found next to main.ts');
  process.exit(1);
}

// Verify it is a true PNG before copying (magic bytes 89 50 4E 47 0D 0A 1A 0A).
const data = readFileSync(src);
const head = data.subarray(0, 8);
const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!head.equals(magic)) {
  console.error('entry.png is not a valid PNG file');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);

// Verify the copy is faithful: the output must exist, match the source
// byte size, and match its sha256, or the run is not a valid copy.
if (!existsSync(dest)) {
  throw new Error(`copy failed: ${dest} does not exist after copy`);
}
const destData = readFileSync(dest);
if (destData.length !== data.length) {
  throw new Error(`copy failed: ${dest} is ${destData.length} bytes, expected ${data.length}`);
}
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
if (sha256(destData) !== sha256(data)) {
  throw new Error(`copy failed: ${dest} sha256 differs from entry.png`);
}
console.log(`copied entry.png to ${dest} (${data.length} bytes, sha256 verified)`);
