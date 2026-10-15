import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// The token is public by design: Cloudflare reads it from the page source
const cloudflareAnalyticsToken = '1798da8c49304457b42b3c8c882e8e71'

// Build only, so visits to the local dev server aren't counted
const cloudflareAnalytics = (): Plugin => ({
  name: 'cloudflare-web-analytics',
  apply: 'build',
  transformIndexHtml: () => [{
    tag: 'script',
    attrs: {
      type: 'module',
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      'data-cf-beacon': JSON.stringify({ token: cloudflareAnalyticsToken })
    },
    injectTo: 'body'
  }]
})

export default defineConfig({
  plugins: [react(), cloudflareAnalytics()],
  // The preview is rendered with the API's own card code and assets, imported straight from api/src
  server: { fs: { allow: ['.', '../api/src'] } }
})
