import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'assets/icons/*.png',
        'assets/images/*.svg',
        'assets/images/*.png',
      ],
      manifest: {
        short_name: 'React HN',
        name: 'React Hacker News',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#fff',
        theme_color: '#b92b27',
        icons: [
          {
            src: '/assets/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/node-hnapi\.herokuapp\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'hn-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
