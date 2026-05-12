import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'e2e',
  retries: 1,
  outputDir: 'test-results',
  reporter: [['json', { outputFile: 'a11y-report.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
