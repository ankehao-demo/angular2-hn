import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/icons/*.png', 'assets/images/*.svg', 'assets/images/*.png'],
      manifest: {
        name: 'Angular 2 HN',
        short_name: 'HN',
        description: 'A Hacker News client built with React',
        theme_color: '#b92b27',
        background_color: '#b92b27',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'assets/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'assets/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/node-hnapi\.herokuapp\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'hn-api-cache', expiration: { maxEntries: 50, maxAgeSeconds: 300 } },
          },
        ],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
});
