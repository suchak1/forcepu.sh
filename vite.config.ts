import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { getThemeVariables } from 'antd/dist/theme';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name].[ext]`
        // "assets/[name]-[hash][extname]"
      }
    }
  },
  // define: {
  // ['global.']: 'window.',
  // global: 'globalThis',

  // globalThis may be better
  // https://blog.logrocket.com/what-is-globalthis-why-use-it/
  // },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // react: 'preact/compat',
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  // css: {
  //   preprocessorOptions: {
  //     less: {
  //       modifyVars: { 'borderRadiusLG': 2 },
  //       // modifyVars: getThemeVariables({
  //       //   dark: true,
  //       //   // compact: true,
  //       // }),
  //       javascriptEnabled: true,
  //     },
  //   },
  // },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
})

// AWS Polyfill issues
// https://github.com/aws-amplify/amplify-js/issues/9639
// add this to index.html
// <script>
//     var global = global || window;
//     var Buffer = Buffer || [];
//     var process = process || {
//       env: { DEBUG: undefined },
//       version: []
//     };
// </script>