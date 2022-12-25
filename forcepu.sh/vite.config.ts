import * as path from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// import pages from 'vite-plugin-react-pages'
import ssr from 'vite-plugin-ssr/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    // pages({
    //   pagesDir: path.join(__dirname, 'pages'),
    // })
    ssr(),
  ],
})
