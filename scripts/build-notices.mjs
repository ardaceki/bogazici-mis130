import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const project = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const packages = new Map();

async function collect(name, from = join(root, 'package.json')) {
  const require = createRequire(from);
  let directory;
  let pkg;
  for (const searchPath of require.resolve.paths(name)) {
    try {
      const candidate = join(searchPath, name);
      pkg = JSON.parse(await readFile(join(candidate, 'package.json'), 'utf8'));
      if (pkg.name === name) {
        directory = candidate;
        break;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  if (!directory) throw new Error(`Cannot locate package metadata for ${name}`);
  const key = `${pkg.name}@${pkg.version}`;
  if (packages.has(key)) return;
  const files = (await readdir(directory)).filter((file) =>
    /^(?:licen[sc]e|copying|notice)(?:\.(?:md|txt))?$/i.test(file),
  );
  if (!files.length) throw new Error(`Missing licence text for ${key}`);
  const texts = await Promise.all(
    files.sort().map((file) => readFile(join(directory, file), 'utf8')),
  );
  packages.set(key, texts.join('\n\n').trim());
  // webR is prebundled. Its browser entry embeds msgpack; REPL-only dependencies
  // are not part of this site's bundle. Review this list when upgrading webR.
  if (name === 'webr') {
    await collect('@msgpack/msgpack', join(directory, 'package.json'));
  } else {
    for (const dependency of Object.keys(pkg.dependencies || {})) {
      await collect(dependency, join(directory, 'package.json'));
    }
  }
}

for (const dependency of Object.keys(project.dependencies)) await collect(dependency);
const ownLicence = await readFile(join(root, 'LICENSE'), 'utf8');
const sections = [...packages].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
const notice = [
  'MIS 130 Workshop — software licences',
  'Original application code: MIT. Course materials and course-derived educational content are excluded.',
  ownLicence.trim(),
  'Third-party notices for the browser application. webR runtime binaries are loaded from the upstream CDN; its complete upstream notice is retained below.',
  ...sections.map(([name, licence]) => `${name}\n${'='.repeat(name.length)}\n\n${licence}`),
].join('\n\n');
await writeFile(join(root, 'public/THIRD_PARTY_NOTICES.txt'), `${notice}\n`);
console.log(`Preserved application licence and ${packages.size} dependency notices.`);
