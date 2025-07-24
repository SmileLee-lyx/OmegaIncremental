import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "crypto": "crypto-browserify",
        },
    },
    base: './',
});
