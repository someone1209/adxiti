import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/adxiti/",
  plugins: [
    {
      name: "copy-classic-letter-script",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "script.js",
          source: readFileSync(resolve(root, "script.js")),
        });
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        kage: resolve(root, "kage.html"),
      },
    },
  },
});
