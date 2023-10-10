import { fileURLToPath, URL } from 'url'
import dotenv from "dotenv";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

dotenv.config();

const PORT = parseInt(process.env.VITE_APP_PORT) || 3000;
const API_URL = process.env.VITE_API_URL ||"localhost"
const API_PORT = process.env.VITE_API_PORT || 5000

const apiBaseUrl = "http://" + (API_PORT ? `${API_URL}:${API_PORT}` : API_URL)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  preview: {
    port: PORT,
    host: true,
    proxy: {
      "/__api": {
        target: apiBaseUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/__api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
