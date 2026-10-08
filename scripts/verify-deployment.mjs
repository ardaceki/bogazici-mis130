import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildFiles, digest } from './build-files.mjs';

async function fetchFile(address) {
  const origin = address.origin;
  let url = address;
  const signal = AbortSignal.timeout(15000);
  for (let hop = 0; hop <= 3; hop++) {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'Cache-Control': 'no-cache' },
      signal,
    });
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get('location');
    await response.body?.cancel();
    if (!location) throw new Error('Redirect has no Location header.');
    url = new URL(location, url);
    if (url.origin !== origin) throw new Error('Redirect leaves the site origin.');
  }
  throw new Error('Too many redirects.');
}

export async function verifyDeployment(address, directory) {
  const base = new URL(address);
  if (!['http:', 'https:'].includes(base.protocol) || base.search || base.hash)
    throw new Error('Use an HTTP(S) site URL without query parameters or a fragment.');
  if (!base.pathname.endsWith('/')) base.pathname += '/';
  // Expected hashes come from the independently rebuilt files, never from the site.
  const files = await buildFiles(directory);
  if (!files['index.html'] || !files['build-manifest.json'])
    throw new Error('Build the site first with npm run build.');
  const results = [];
  const entries = Object.entries(files);
  for (let offset = 0; offset < entries.length; offset += 4) {
    results.push(
      ...(await Promise.all(
        entries.slice(offset, offset + 4).map(async ([path, expected]) => {
          const relative =
            path === 'index.html' ? '' : path.split('/').map(encodeURIComponent).join('/');
          const url = new URL(relative, base);
          try {
            const response = await fetchFile(url);
            if (!response.ok) return { path, matched: false, reason: `HTTP ${response.status}` };
            const actual = digest(new Uint8Array(await response.arrayBuffer()));
            return {
              path,
              matched: actual === expected,
              reason: actual === expected ? '' : 'SHA-256 differs',
            };
          } catch (error) {
            return { path, matched: false, reason: `Request failed: ${error.message}` };
          }
        }),
      )),
    );
  }
  return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (!process.argv[2])
      throw new Error('Usage: npm run verify:deployment -- https://mis130.site');
    const results = await verifyDeployment(
      process.argv[2],
      fileURLToPath(new URL('../dist/', import.meta.url)),
    );
    const failed = results.filter((result) => !result.matched);
    if (failed.length) {
      for (const { path, reason } of failed) console.error(`${path}: ${reason}`);
      console.error(`NOT VERIFIED: ${failed.length} of ${results.length} files did not match.`);
      process.exitCode = 1;
    } else
      console.log(`VERIFIED: all ${results.length} rebuilt files match the site byte for byte.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
