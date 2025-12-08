import { defineConfig } from 'vite' // Redeploy Timestamp: 2025-12-08T13:30:00Z
import react from '@vitejs/plugin-react'
// tailwindcss v4 beta types
import tailwindcss from '@tailwindcss/vite'
// import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
   // VitePWA({...})
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
