import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { getThemeVariables } from 'antd/dist/theme';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {},
    // global: 'globalThis',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // react: 'preact/compat',
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     less: {
  //       // modifyVars: { 'primary-color': '#13c2c2' },
  //       modifyVars: getThemeVariables({
  //         dark: true,
  //         // compact: true,
  //       }),
  //       javascriptEnabled: true,
  //     },
  //   },
  // },
})
