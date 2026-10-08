import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
import { existsSync } from 'node:fs';
import { stripVTControlCharacters } from 'node:util';
import assert from 'node:assert/strict';
import { verifyDeployment } from './verify-deployment.mjs';

// An explicit URL tests an existing deployment. Otherwise own the local preview
// process so contributors do not need to manage a second terminal.
if (process.env.WORKSHOP_PREVIEW_URL) {
  await import('../tests/production-smoke.mjs');
} else {
  if (!existsSync(new URL('../dist/index.html', import.meta.url))) {
    throw new Error('Build the site first with npm run build.');
  }
  const preview = spawn(
    process.execPath,
    [
      fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)),
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      '4173',
      '--strictPort',
    ],
    { cwd: fileURLToPath(new URL('..', import.meta.url)), stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let logs = '';
  preview.stdout.on('data', (chunk) => {
    logs += chunk;
  });
  preview.stderr.on('data', (chunk) => {
    logs += chunk;
  });
  const exited = once(preview, 'exit');
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (preview.exitCode !== null) throw new Error(`Preview failed to start:\n${logs}`);
      try {
        if (!stripVTControlCharacters(logs).includes('http://127.0.0.1:4173/')) {
          await delay(100);
          continue;
        }
        ready = (await fetch('http://127.0.0.1:4173', { signal: AbortSignal.timeout(500) })).ok;
      } catch {
        /* Wait for the preview socket to open. */
      }
      if (ready) break;
      await delay(100);
    }
    if (!ready) throw new Error(`Preview did not become ready:\n${logs}`);
    const files = await verifyDeployment(
      'http://127.0.0.1:4173',
      fileURLToPath(new URL('../dist/', import.meta.url)),
    );
    assert.deepEqual(
      files.filter((file) => !file.matched),
      [],
      'Preview must serve the exact build.',
    );
    await import('../tests/production-smoke.mjs');
  } finally {
    if (preview.exitCode === null) preview.kill();
    await exited;
  }
}
