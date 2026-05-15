import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // এই লাইনটি যোগ করুন

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // এই লাইনটি যোগ করুন
  ],
})