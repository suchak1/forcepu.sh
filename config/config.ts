import { defineConfig } from 'umi';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;

export default defineConfig({
  // presets: [
  //   '@umijs/preset-react'
  // ],
  plugins: [],
  antd: { dark: true },
  dva: {
    // immer: true,
    hmr: true,
  },
  locale: {
    // default: 'us-EN',
    baseNavigator: true,
  },
  proxy: proxy[REACT_APP_ENV || 'prod'],
  // publicPath: 'assets/'
  theme: {'switch-color': '#F7931A'},
  metas: [
    {
      name: 'viewport',
      // content: "width=device-width,height=device-height,initial-scale=1.0"
      content: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
    }]
});