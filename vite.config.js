import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),

    VitePWA({ 
      injectRegister: 'inline',
      registerType: 'autoUpdate',
      includeAssets: ['assets/*.*.js', 'assets/*.*.css', 'favicon.ico', 'fonts/*.woff', 'fonts/*.woff2', 'icons/*.png',  'sounds/*.wav'],
      manifest: {
        "name": "Timesets",
        "short_name": "Timesets",
        "theme_color": "#0a0a0a",
        "background_color": "#0a0a0a",
        "display": "standalone",
        "scope": "/",
        "start_url": "/index.html",
        "icons": [
          {
            "src": "icons/icon-32.png",
            "sizes": "32x32",
            "type": "image/png",
            "purpose": "maskable any"
          },
          {
            "src": "icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable any"
          },
          {
            "src": "icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable any"
          }
        ]
      },
      devOptions: {
        enabled: true
        /* other options */
      }
    })
  ]
})
