import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The preview is rendered with the API's own card code and assets, imported straight from api/src
  server: { fs: { allow: ['.', '../api/src'] } }
})
