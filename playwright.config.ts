import { defineConfig, devices } from '@playwright/test';

// Simple: Just use the PORT env var or default
// The webServer will start on whatever port is available
// and Playwright will automatically use that URL
const PORT = process.env.PORT || (process.env.CI ? '3000' : '3001');
const baseURL = `http://localhost:${PORT}`;

/**
 * Playwright configuration for scenario validation tests
 * Runs headless in CI, configurable for local development
 */
export default defineConfig({
  // Test directory
  testDir: './tests/specs',

  // Global timeout for each test
  timeout: 30000,

  // Don't run tests in parallel by default (avoid session conflicts)
  // Individual test files can opt-in with test.describe.configure({ mode: 'parallel' })
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Workers: 1 in CI (stable), ~50% CPU cores locally
  workers: process.env.CI ? 1 : undefined,

  // Reporter: list for terminal output, html for detailed reports
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  // Shared settings for all projects
  use: {
    // Base URL - auto-detected from running Next.js server
    baseURL,

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on retry
    video: 'retain-on-failure',

    // Always headless (no GUI)
    headless: true,
  },

  // Test projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start dev server before running tests (only in CI, locally use existing server)
  webServer: process.env.CI ? {
    command: `HIGHLIGHTER_SCRIPT_PATH=node_modules/@probolabs/highlighter/dist/probolabs.umd.js DATABASE_URL=file:./test.db SCENARIO_CACHE_DIR=.cache/scenarios PORT=${PORT} pnpm dev`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120000, // 2 minutes to start
  } : {
    command: `PORT=${PORT} pnpm dev`,
    url: baseURL,
    reuseExistingServer: true, // Use existing server locally
    timeout: 120000,
  },
});
