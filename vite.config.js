import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Temporary polyfill
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Set up aliases to match jsconfig.json
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      pages: path.resolve(__dirname, "./src/pages"),
      styles: path.resolve(__dirname, "./src/styles"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
});
