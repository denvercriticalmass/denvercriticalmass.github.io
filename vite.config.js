// vite.config.js
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { defineConfig } from "vite";

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
  plugins: [tailwindcss()],
});
