import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Temporary polyfill
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/claude": {
        target: "https://api.anthropic.com/v1/messages",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/claude/, ""),
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq, req, res) => {
            // Add headers
            proxyReq.setHeader("x-api-key", process.env.VITE_ANTHROPIC_API_KEY);
            proxyReq.setHeader("anthropic-version", "2023-06-01");
          });
        },
      },
    },
  },
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
