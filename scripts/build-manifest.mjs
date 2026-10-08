import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildFiles } from './build-files.mjs';

const directory = new URL('../dist/', import.meta.url);
const files = await buildFiles(fileURLToPath(directory));
delete files['build-manifest.json'];
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
await writeFile(
  new URL('build-manifest.json', directory),
  JSON.stringify({ format: 1, version, algorithm: 'sha256', files }, null, 2) + '\n',
);
console.log(`Wrote SHA-256 manifest for ${Object.keys(files).length} build files.`);
