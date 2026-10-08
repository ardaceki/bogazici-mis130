import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tasks } from '../src/content/index.js';
import { taskSources } from '../src/content/sources.js';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const links = tasks.flatMap((task) => taskSources[task.id].references);
const unique = [...new Map(links.map((ref) => [ref.href, ref])).values()];
for (const ref of unique) {
  const [url, fragment] = ref.href.split('#');
  const filename = path.join(root, 'public', url);
  if (!fs.existsSync(filename)) throw new Error(`Missing source file: ${ref.href}`);
  if (url.endsWith('.html') && !fs.readFileSync(filename, 'utf8').includes(`id="${fragment}"`))
    throw new Error(`Missing HTML section: ${ref.href}`);
  if (url.endsWith('.pdf') && !/^page=[1-9]\d*$/.test(fragment))
    throw new Error(`Missing PDF page locator: ${ref.href}`);
}
console.log(`${tasks.length} task mappings and ${unique.length} distinct source targets verified.`);
