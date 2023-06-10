export default {
  video: Boolean(process.env.CI),
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("before:browser:launch", (browser = {}, launchOptions) => {
        // `args` is an array of all the arguments that will
        // be passed to browsers when it launches
        console.log(launchOptions.args); // print all current args

        launchOptions.args = launchOptions.args.map((arg) => {
          if (arg.startsWith("--proxy-bypass-list")) {
            return "--proxy-bypass-list=<-loopback>,ws://*localhost*:8000";
          }

          return arg;
        });

        if (browser.family === "chromium" && browser.name !== "electron") {
          // auto open devtools
          launchOptions.args.push("--auto-open-devtools-for-tabs");
        }

        // whatever you return here becomes the launchOptions

        console.log("final args", launchOptions.args); // print all current args

        return launchOptions;
      });
    },
    testIsolation: false,
  },
};
