// Modified 2026-10-25: bundle package-managed browser dependencies for deployment.
import { defineConfig } from 'vite';

export default defineConfig({
    publicDir: 'public',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
});
