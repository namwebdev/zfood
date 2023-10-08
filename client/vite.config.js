import { fileURLToPath, URL } from 'url'
import dotenv from "dotenv";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

dotenv.config();

const PORT = parseInt(process.env.VITE_APP_PORT) || 3000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: PORT,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
