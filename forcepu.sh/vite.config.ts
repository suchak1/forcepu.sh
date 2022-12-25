import path from 'path'
import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
// import { getThemeVariables } from 'antd/dist/theme';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: {},
    // global: 'globalThis',
  },
  plugins: [preact()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: 'preact/compat',
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
