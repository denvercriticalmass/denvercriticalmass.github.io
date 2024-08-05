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
        main: resolve(__dirname, "./src/index.html"),
        legal: resolve(__dirname, "./src/legal/index.html"),
      },
    },
  },
  plugins: [compress],
});
