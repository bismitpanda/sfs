import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 2004,
    },
    root: "windows",
    publicDir: "../public",
    build: {
        cssMinify: "lightningcss",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "windows/main.html"),
                login: resolve(__dirname, "windows/login.html"),
                viewer: resolve(__dirname, "windows/viewer.html"),
            },
        },
        outDir: "../dist",
        emptyOutDir: true,
    },
    esbuild: {
        legalComments: "eof",
    },
    resolve: {
        alias: {
            "@modals": resolve(__dirname, "./src-app/components/modals"),
            "@components": resolve(__dirname, "./src-app/components"),
            "@context": resolve(__dirname, "./src-app/context"),
            "@type": resolve(__dirname, "./src-app/types"),
            "@utils": resolve(__dirname, "./src-app/utils"),
            "@hooks": resolve(__dirname, "./src-app/hooks"),
        },
    },
});
