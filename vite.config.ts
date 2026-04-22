/// <reference types="vitest" />
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
        'assets/images/*.png',
      ],
      manifest: {
        name: 'Angular 2 HN',
        short_name: 'ngHN',
        description: 'Hacker News client built with React',
        theme_color: '#b92b27',
        background_color: '#b92b27',
        display: 'standalone',
        start_url: '/?utm_source=homescreen',
        icons: [
          { src: '/assets/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
          { src: '/assets/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/assets/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/assets/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icons/icon-256x256.png', sizes: '256x256', type: 'image/png' },
          { src: '/assets/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/assets/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
