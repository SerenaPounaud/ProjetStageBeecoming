import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl: "http://localhost:4200",

    setupNodeEvents(on, config) {
      // événements Cypress si besoin plus tard
      return config;
    },
  },
});