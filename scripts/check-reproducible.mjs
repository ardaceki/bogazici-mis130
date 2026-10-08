import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildFiles } from './build-files.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = fileURLToPath(new URL('../dist/', import.meta.url));
function build() {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`Build failed with status ${result.status}`);
}
build();
const first = await buildFiles(directory);
build();
assert.deepEqual(await buildFiles(directory), first, 'Repeated builds produced different bytes.');
console.log(`Reproducible: all ${Object.keys(first).length} files match across two builds.`);
