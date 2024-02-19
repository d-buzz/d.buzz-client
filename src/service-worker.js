/* eslint-disable no-restricted-globals */

// Importing necessary Workbox modules
import { clientsClaim } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

// Claiming clients for immediate control
clientsClaim()

// Precaching assets generated during the build process
// Ensure that self.__WB_MANIFEST is included only once in your service worker file
precacheAndRoute(self.__WB_MANIFEST)

// Service worker update and activation handling
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        // eslint-disable-next-line array-callback-return
        cacheNames.map((cacheName) => {
          // Adjust this condition to match your app's cache naming convention
          if (!cacheName.includes('workbox')) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// App Shell routing for SPA
registerRoute(
  ({ request, url }) => {
    if (request.mode !== 'navigate') {
      return false
    }
    if (url.pathname.startsWith('/_')) {
      return false
    }
    if (url.pathname.match(new RegExp('/[^/?]+\\.[^/]+$'))) {
      return false
    }
    return true
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
)

// Runtime caching for images
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 50 })],
  })
)

// Skip waiting message listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Add any other custom service worker logic below
