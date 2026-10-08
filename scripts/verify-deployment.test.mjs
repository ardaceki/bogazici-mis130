import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { verifyDeployment } from './verify-deployment.mjs';

test('verification follows same-site canonical URLs and rejects modified, missing or off-site responses', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'workshop-verification-'));
  await mkdir(join(directory, 'assets'));
  await writeFile(join(directory, 'index.html'), '<script src="/assets/app.js"></script>');
  await writeFile(join(directory, 'assets/app.js'), 'console.log("original");');
  await writeFile(join(directory, 'build-manifest.json'), '{"format":1}');
  await writeFile(join(directory, 'privacy.html'), '<h1>Privacy</h1>');
  let mode = 'original';
  const server = createServer(async (request, response) => {
    const file =
      request.url === '/'
        ? 'index.html'
        : request.url === '/privacy'
          ? 'privacy.html'
          : request.url.slice(1);
    if (request.url === '/privacy.html') {
      response.writeHead(307, { Location: '/privacy' }).end();
    } else if (file === 'assets/app.js' && mode === 'missing') {
      response.writeHead(404).end();
    } else if (file === 'assets/app.js' && mode === 'redirect') {
      response.writeHead(302, { Location: '/' }).end();
    } else if (file === 'assets/app.js' && mode === 'offsite') {
      response.writeHead(302, { Location: 'https://example.invalid/app.js' }).end();
    } else if (file === 'assets/app.js' && mode === 'loop') {
      response.writeHead(302, { Location: '/assets/app.js' }).end();
    } else if (file === 'assets/app.js' && mode === 'modified') {
      response.end('console.log("changed");');
    } else if (file === 'build-manifest.json' && mode === 'manifest') {
      response.end('{"format":1,"claim":"all files match"}');
    } else response.end(await readFile(join(directory, file)));
  });
  try {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = `http://127.0.0.1:${server.address().port}`;
    assert((await verifyDeployment(address, directory)).every((result) => result.matched));
    for (const changed of ['modified', 'missing', 'redirect', 'offsite', 'loop', 'manifest']) {
      mode = changed;
      const failures = (await verifyDeployment(address, directory)).filter(
        (result) => !result.matched,
      );
      assert.equal(failures.length, 1, changed);
      assert.equal(
        failures[0].path,
        changed === 'manifest' ? 'build-manifest.json' : 'assets/app.js',
      );
    }
    await assert.rejects(verifyDeployment('file:///tmp/site', directory), /HTTP/);
    await assert.rejects(verifyDeployment(address + '/?version=1', directory), /HTTP/);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(directory, { recursive: true, force: true });
  }
});
