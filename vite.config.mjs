import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    root: path.resolve(__dirname, 'src/app/react'),
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, 'src/app/shared'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                includePaths: [path.resolve(__dirname, 'src/app')],
            },
        },
    },
    server: {
        port: 4200,
    },
});
