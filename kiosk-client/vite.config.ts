import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    server: {
        port: 4201,        // change this to any port you want
        strictPort: true,  // prevents fallback ports like 57252
        host: true         // allows Capacitor / mobile device access
    },
    plugins: [angular()],
});
