import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * GitHub Pages serves 404.html for any path it does not know, so copying the
 * built index.html there lets deep links such as /chorde/song/123 work instead
 * of returning a 404 page.
 */
const spaFallback = (): Plugin => ({
  name: 'spa-fallback',
  closeBundle() {
    const outDir = resolve(__dirname, 'dist');
    const index = resolve(outDir, 'index.html');
    if (existsSync(index)) {
      copyFileSync(index, resolve(outDir, '404.html'));
    }
  },
});

export default defineConfig({
  plugins: [
    react(),
    spaFallback(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Chorde Songbook',
        short_name: 'Chorde',
        description: 'A local-first ChordPro songbook.',
        theme_color: '#18181B',
        background_color: '#18181B',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache search API responses so results stay available offline.
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
            },
          },
        ],
      },
    }),
  ],
  base: '/chorde/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
