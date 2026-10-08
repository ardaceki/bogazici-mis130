import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function buildFiles(directory, prefix = '') {
  const files = {};
  const entries = await readdir(join(directory, prefix), { withFileTypes: true });
  entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  for (const entry of entries) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) Object.assign(files, await buildFiles(directory, name + '/'));
    else if (entry.isFile()) files[name] = digest(await readFile(join(directory, name)));
    else throw new Error(`Unexpected non-regular build entry: ${name}`);
  }
  return files;
}
