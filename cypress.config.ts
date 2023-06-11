import path from 'path';
import { fileURLToPath } from 'url';
import vitePreprocessor from 'cypress-vite';
import codeCoverage from '@cypress/code-coverage/task'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  video: Boolean(process.env.CI),
  e2e: {
    baseUrl: 'http://localhost:8000',
    experimentalMemoryManagement: Boolean(process.env.CI),
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on(
        'file:preprocessor',
        vitePreprocessor({
          configFile: path.resolve(__dirname, './vite.config.ts'),
          mode: 'development',
        }),
      )
      codeCoverage(on, config)
      return config;
    },
  },
};
