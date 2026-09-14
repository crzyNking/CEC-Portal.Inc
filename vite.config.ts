import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'CEC Portal',
        short_name: 'CEC Portal',
        description: 'Cebu Eastern College - Excellence in Education since 1915',
        theme_color: '#0b1f40',
        background_color: '#0b1f40',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['education', 'school'],
        icons: [
          {
            src: 'https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-6/302130535_582267347020947_5642845133722350033_n.jpg?stp=dst-jpg_tt6&cstp=mx2043x2048&ctp=s2043x2048&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHQ-qulZKv6ih1XSQMneMJo0E3N8tptuK7QTc3y2m24rvOZF2gXoVReo42hSnhjrOVF3VaaiIacXYLr4V0tLBnV&_nc_ohc=DwgPGVR3NxAQ7kNvwHK2pVM&_nc_oc=AdoInhwFcJYyYSg0fa1Wpz-R1dFpwsMHl6mtfS7QQWRNvdszfV8gOVSeeWRJhBwsRSs&_nc_zt=23&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=RqDzkeCt_v0gef-tKSvDhg&_nc_ss=7b2a8&oh=00_AQINJ7xEPsV6TffMVbW2gBUDNvKlNIW-johLvoePCsVJnQ&oe=6AADDDCC',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-6/302130535_582267347020947_5642845133722350033_n.jpg?stp=dst-jpg_tt6&cstp=mx2043x2048&ctp=s2043x2048&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHQ-qulZKv6ih1XSQMneMJo0E3N8tptuK7QTc3y2m24rvOZF2gXoVReo42hSnhjrOVF3VaaiIacXYLr4V0tLBnV&_nc_ohc=DwgPGVR3NxAQ7kNvwHK2pVM&_nc_oc=AdoInhwFcJYyYSg0fa1Wpz-R1dFpwsMHl6mtfS7QQWRNvdszfV8gOVSeeWRJhBwsRSs&_nc_zt=23&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=RqDzkeCt_v0gef-tKSvDhg&_nc_ss=7b2a8&oh=00_AQINJ7xEPsV6TffMVbW2gBUDNvKlNIW-johLvoePCsVJnQ&oe=6AADDDCC',
            sizes: '512x512',
            type: 'image/jpeg'
          },
          {
            src: 'https://scontent.fmnl4-7.fna.fbcdn.net/v/t39.30808-6/302130535_582267347020947_5642845133722350033_n.jpg?stp=dst-jpg_tt6&cstp=mx2043x2048&ctp=s2043x2048&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHQ-qulZKv6ih1XSQMneMJo0E3N8tptuK7QTc3y2m24rvOZF2gXoVReo42hSnhjrOVF3VaaiIacXYLr4V0tLBnV&_nc_ohc=DwgPGVR3NxAQ7kNvwHK2pVM&_nc_oc=AdoInhwFcJYyYSg0fa1Wpz-R1dFpwsMHl6mtfS7QQWRNvdszfV8gOVSeeWRJhBwsRSs&_nc_zt=23&_nc_ht=scontent.fmnl4-7.fna&_nc_gid=RqDzkeCt_v0gef-tKSvDhg&_nc_ss=7b2a8&oh=00_AQINJ7xEPsV6TffMVbW2gBUDNvKlNIW-johLvoePCsVJnQ&oe=6AADDDCC',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 10
            }
          }
        ],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
})
