import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config();

const PORT = parseInt(process.env.VITE_APP_PORT) || 8000;
const API_URL = process.env.VITE_API_URL || "localhost";
const API_PORT = parseInt(process.env.VITE_API_PORT) || 3000;

const apiBaseUrl = API_PORT ? `${API_URL}:${API_PORT}` : API_URL;

const proxyConfig = {
  "/__api": {
    target: apiBaseUrl,
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/__api/, ""),
  },
};

export default defineConfig({
  plugins: [vue()],
  server: {
    port: PORT,
    proxy: proxyConfig,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@@": resolve(__dirname, "src/components"),
    },
  },
});
