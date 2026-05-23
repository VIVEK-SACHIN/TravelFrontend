import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const THEME_IDS = ['green', 'ocean', 'sunset', 'violet', 'rose'] as const

function resolveThemeId(raw: string | undefined): string {
  const id = (raw ?? 'green').trim().toLowerCase()
  return THEME_IDS.includes(id as (typeof THEME_IDS)[number]) ? id : 'green'
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const themeId = resolveThemeId(env.VITE_THEME)

  return {
    plugins: [
      react(),
      {
        name: 'html-theme',
        transformIndexHtml(html) {
          return html.replace(
            '<html lang="en">',
            `<html lang="en" data-theme="${themeId}">`,
          )
        },
      },
    ],
    server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
    port: 5173,
    // Same-origin API so JWT cookies work (https:5173 → http:3000 is cross-site).
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Static images on the API server (`public/img/users`, `public/img/tours`).
      '/img/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/img/tours': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    },
  }
})
