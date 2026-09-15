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
      includeAssets: ['favicon.ico', 'icons/icon.svg'],
      manifest: {
        name: 'CEC Portal - Cebu Eastern College',
        short_name: 'CEC Portal',
        description: 'Cebu Eastern College - Excellence in Education since 1915. Manage enrollment, view campus info, and stay connected.',
        theme_color: '#0b1f40',
        background_color: '#0b1f40',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['education', 'school'],
        lang: 'en',
        dir: 'ltr',
        id: '/',
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'View your dashboard',
            url: '/dashboard',
            icons: [{ src: 'icons/icon.svg', sizes: '192x192' }]
          },
          {
            name: 'Enrollment',
            short_name: 'Enroll',
            description: 'Start enrollment process',
            url: '/enrollment/college',
            icons: [{ src: 'icons/icon.svg', sizes: '192x192' }]
          },
          {
            name: 'Campus',
            short_name: 'Campus',
            description: 'Explore campus information',
            url: '/campus/main',
            icons: [{ src: 'icons/icon.svg', sizes: '192x192' }]
          },
          {
            name: 'News',
            short_name: 'News',
            description: 'Latest news and updates',
            url: '/news',
            icons: [{ src: 'icons/icon.svg', sizes: '192x192' }]
          },
          {
            name: 'Profile',
            short_name: 'Profile',
            description: 'Manage your profile',
            url: '/profile',
            icons: [{ src: 'icons/icon.svg', sizes: '192x192' }]
          }
        ],
        share_target: {
          action: '/share',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        },
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'icons/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          },
          {
            src: 'icons/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
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
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-storage-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-rest-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60
              },
              networkTimeoutSeconds: 5
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/.*/i,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'supabase-auth-cache'
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/realtime\/.*/i,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'supabase-realtime-cache'
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60
              },
              networkTimeoutSeconds: 5
            }
          },
          {
            urlPattern: /^https:\/\/cdn\.vectorstock\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'vectorstock-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /^https:\/\/static\.wikia\.nocookie\.net\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wikia-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/admin/],
        cleanupOutdatedCaches: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: false
      }
    })
  ],
})
