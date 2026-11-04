import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/adxiti/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        kage: resolve(root, "kage.html"),
      },
    },
  },
});
