import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const distDirectory = new URL('../dist/', import.meta.url);
const index = await readFile(new URL('index.html', distDirectory), 'utf8');
const assets = await readdir(new URL('assets/', distDirectory));
const publicPreview = await readFile(new URL('og-image.jpg', distDirectory));

const checks = [
  ['built HTML references a JavaScript bundle', /<script[^>]+src="\/assets\/[^\"]+\.js"/.test(index)],
  ['built HTML references a stylesheet', /<link[^>]+href="\/assets\/[^\"]+\.css"/.test(index)],
  ['profile image is included in the build', assets.some((asset) => /^profile-.*\.jpg$/.test(asset))],
  ['social preview image is included in the build', publicPreview.length > 0],
];

const failedChecks = checks.filter(([, passed]) => !passed).map(([label]) => label);
if (failedChecks.length) {
  throw new Error(`Build smoke test failed: ${failedChecks.join('; ')}`);
}

console.log('Build smoke test passed.');