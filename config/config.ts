import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [],
  antd: { dark: true },
  // publicPath: 'assets/'
  theme: {'switch-color': '#F7931A'},
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
    }
  ],
  proxy: {
    '/api': {
      'target': 'http://localhost:3000',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : '' },
    }
  },
  // nodeModulesTransform: {
  //   type: 'none',
  //   exclude: [],
  // },
  // dynamicImport: {},
  // chunks: ['vendors', 'umi'],
  // chainWebpack: function (config, { webpack }) {
  //   config.merge({
  //     optimization: {
  //       splitChunks: {
  //         chunks: 'all',
  //         minSize: 30000,
  //         minChunks: 1,
  //       }
  //     }
  //   })
  // }
  // mfsu: {}
});