// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import compress from "vite-plugin-compress";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        legal: resolve(__dirname, "legal/index.html"),
      },
    },
  },
  plugins: [compress],
});
