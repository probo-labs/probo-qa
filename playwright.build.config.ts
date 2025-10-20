import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for build smoke tests
 * These tests manage their own processes and don't need webServer
 */
export default defineConfig({
  // Test directory
  testDir: './tests/specs',

  // Longer timeout for build tests (up to 3 minutes per test)
  timeout: 180000,

  // Run serially (build tests are already configured this way)
  fullyParallel: false,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // No retries for build tests (they should be deterministic)
  retries: 0,

  // Single worker (build tests run serially anyway)
  workers: 1,

  // Reporter: list for terminal output
  reporter: [['list']],

  // Shared settings for all projects
  use: {
    // No baseURL needed (build tests don't navigate)
    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

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

  // NO webServer config - build tests manage their own processes
});
