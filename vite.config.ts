/// <reference types="vitest" />
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
                name: 'React HN',
                short_name: 'React HN',
                theme_color: '#b92b27',
                background_color: '#b92b27',
                display: 'standalone',
                start_url: '/',
                icons: [
                    { src: '/assets/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
                    { src: '/assets/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
                    { src: '/assets/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
                ],
            },
            workbox: {
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/node-hnapi\.herokuapp\.com\/.*/,
                        handler: 'NetworkFirst',
                        options: { cacheName: 'api-cache' },
                    },
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
                // Make theme variables available globally if needed
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
    },
});
