export default {
  presets: [
    '@umijs/preset-react'
  ],
  plugins: [],
  antd: {},
  dva: {
    immer: true,
    hmr: true,
  },
  locale: {
    default: 'us-EN',
    baseNavigator: true,
  },
  theme: {

  }
}