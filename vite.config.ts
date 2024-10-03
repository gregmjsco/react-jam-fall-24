import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import rune from "rune-sdk/vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "public"),
    },
  },
  base: "", // Makes paths relative
  plugins: [react(), rune({ logicPath: path.resolve("./src/logic/logic.ts") })],
});
