import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Angular 2 HN',
        short_name: 'HN',
        description: 'A Hacker News client built with React',
        theme_color: '#b92b27',
        background_color: '#b92b27',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/assets/icons/android-chrome-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/assets/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icons/android-chrome-256x256.png', sizes: '256x256', type: 'image/png' },
          { src: '/assets/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // This will allow importing the existing Angular SCSS variables/mixins later
      },
    },
  },
});
