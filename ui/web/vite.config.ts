import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "node:path";
import dotenv from 'dotenv';

dotenv.config();
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3200,
        proxy: {
            "/api/security": {
                target: 'http://localhost:8099',
                changeOrigin: true,
            },
            '/api/signal': {
                target: 'ws://localhost:8099',
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
