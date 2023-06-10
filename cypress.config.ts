export default {
  video: Boolean(process.env.CI),
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};
