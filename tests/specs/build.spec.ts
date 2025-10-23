import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Build Smoke Test
 *
 * Verify that production build completes successfully.
 * This test runs in a separate CI job before functional tests (fail fast).
 *
 * Run with: pnpm test:build
 */

test.describe('Build Smoke Tests', () => {
  test.describe.configure({ mode: 'serial', timeout: 180000 });

  const projectRoot = process.cwd();
  const nextDir = join(projectRoot, '.next');

  test('production build completes successfully', async () => {
    // Clean .next before production build (production build needs clean slate)
    if (existsSync(nextDir)) {
      rmSync(nextDir, { recursive: true, force: true });
    }

    // Run production build
    try {
      execSync('pnpm build', {
        cwd: projectRoot,
        stdio: 'pipe',
        timeout: 180000, // 3 minutes max
        env: {
          ...process.env,
          CI: 'true',
        },
      });

      // Verify .next directory was created
      expect(existsSync(nextDir)).toBe(true);

      // Verify build output exists
      const buildManifest = join(nextDir, 'build-manifest.json');
      expect(existsSync(buildManifest)).toBe(true);

    } catch (error) {
      // If build fails, log the error and fail the test
      const err = error as { stdout?: Buffer; stderr?: Buffer; message?: string };
      console.error('Production build failed:');
      console.error(err.stdout?.toString());
      console.error(err.stderr?.toString());
      throw new Error(`Production build failed: ${err.message}`);
    }
  });
});
