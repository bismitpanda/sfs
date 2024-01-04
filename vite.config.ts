import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3333,
    },
    build: {
        cssMinify: "lightningcss",
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                login: resolve(__dirname, "login.html"),
            },
        },
    },
    esbuild: {
        legalComments: "eof",
    },
});
