import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'k95897',
  e2e: {
    specPattern: 'cypress/e2e/*.cy.js'
  },
});
