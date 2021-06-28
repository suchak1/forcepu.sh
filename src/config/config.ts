export default {
  presets: [
    '@umijs/preset-react'
  ],
  plugins: [],
  antd: {compact: true, dark: true},
  dva: {
    immer: true,
    hmr: true,
  },
  locale: {
    default: 'us-EN',
    baseNavigator: true,
  },
  theme: {
    dark: true
  }
}