import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'freshwordlogo.jpg'],
      manifest: {
        name: 'Church Management System',
        short_name: 'FreshWord',
        description: 'A church management system for admins and members',
        theme_color: '#0f766e',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/freshwordlogo.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: '/freshwordlogo.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          },
          {
            src: '/freshwordlogo.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
