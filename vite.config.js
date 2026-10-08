import { defineConfig } from 'vite';
export default defineConfig(({ mode }) => ({
  server: {
    // Generated test/deployment files must not reload an active browser R session.
    watch:
      mode === 'test'
        ? null
        : {
            ignored: [
              '**/tests/artifacts/**',
              '**/test-results/**',
              '**/playwright-report/**',
              '**/.wrangler/**',
            ],
          },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: { target: 'es2022', rollupOptions: { input: ['index.html', 'privacy.html'] } },
}));
