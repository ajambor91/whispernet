import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "node:path";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api/signal': {
                target: 'ws://localhost:8099', // Adres serwera backendowego
                changeOrigin: true,
                ws: true
            },
            '/api': {
                target: 'http://localhost:8099',
                changeOrigin: true,
            },
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
