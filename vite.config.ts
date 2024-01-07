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
                main: resolve(__dirname, "main.html"),
                login: resolve(__dirname, "login.html"),
            },
        },
    },
    esbuild: {
        legalComments: "eof",
    },
    resolve: {
        alias: {
            "@modals": resolve(__dirname, "./src/components/modals"),
            "@components": resolve(__dirname, "./src/components"),
            "@context": resolve(__dirname, "./src/context"),
            "@type": resolve(__dirname, "./src/types"),
            "@utils": resolve(__dirname, "./src/utils"),
            "@hooks": resolve(__dirname, "./src/hooks"),
        },
    },
});
