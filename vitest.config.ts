import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

// Dedicated Vitest config. Deliberately does NOT load the Laravel Vite plugin —
// that plugin starts a dev server and refuses to run in CI. Tests only need Vue
// SFC compilation + a DOM, so we load just @vitejs/plugin-vue here.
export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        include: ['resources/js/**/*.{test,spec}.{js,ts}'],
        globals: true,
    },
});
