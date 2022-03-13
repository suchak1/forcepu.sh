import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [],
  antd: { dark: true },
  dva: {
    hmr: true,
  },
  locale: {
    baseNavigator: true,
  },
  // publicPath: 'assets/'
  theme: {'switch-color': '#F7931A'},
  metas: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
    }]
});