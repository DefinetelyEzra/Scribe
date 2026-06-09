import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      '@modules':    path.resolve(__dirname, './src/modules'),
      '@renderer':   path.resolve(__dirname, './src/renderer'),
      '@store':      path.resolve(__dirname, './src/store'),
      '@components': path.resolve(__dirname, './src/components'),
      '@styles':     path.resolve(__dirname, './src/styles'),
      '@types':        path.resolve(__dirname, './src/types')
    }
  }
})
