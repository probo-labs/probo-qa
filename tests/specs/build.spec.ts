import { test, expect } from '@playwright/test';
import { execSync, spawn, type ChildProcess } from 'child_process';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';
import { createServer } from 'net';

/**
 * Build Smoke Tests
 *
 * Verify that both production and development builds complete successfully.
 * These tests run in a separate CI job before functional tests (fail fast).
 *
 * Run with: pnpm test:build
 */

// Find a free port dynamically
// Note: There's a small race condition between closing the test server and using the port,
// but this is acceptable for tests and extremely rare in practice
async function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error('Failed to get port'));
      }
    });
  });
}

// Wait for server to respond on port, with optional process monitoring
async function waitForPort(
  port: number,
  timeoutMs: number = 60000,
  checkAbort?: () => boolean
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    // Check if we should abort early (e.g., process crashed)
    if (checkAbort && checkAbort()) {
      return false;
    }

    try {
      const response = await fetch(`http://localhost:${port}`);
      // Server is ready if we get any HTTP response (even errors like 404)
      if (response && response.status < 600) {
        return true;
      }
    } catch {
      // Server not ready yet (connection refused), wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return false;
}

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
          DATABASE_URL: process.env.DATABASE_URL || 'file:./test.db',
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

  test('development build starts successfully', async () => {
    // Find a free port dynamically
    const port = await findFreePort();
    console.log(`[Dev Build Test] Using port: ${port}`);

    let devServer: ChildProcess | null = null;
    let processError: Error | null = null;
    let hasExited = false;

    try {
      // Start dev server
      devServer = spawn('pnpm', ['dev'], {
        cwd: projectRoot,
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL || 'file:./test.db',
          PORT: port.toString(),
        },
        stdio: 'pipe',
      });

      // Collect output for debugging
      const outputChunks: string[] = [];
      devServer.stdout?.on('data', (data) => {
        outputChunks.push(data.toString());
      });
      devServer.stderr?.on('data', (data) => {
        outputChunks.push(data.toString());
      });

      // Handle process errors (e.g., pnpm not found, crash during startup)
      devServer.on('error', (err) => {
        processError = err;
        console.error('[Dev Build Test] Process error:', err);
      });

      // Track ANY exit during startup (even code 0) as potential failure
      devServer.on('exit', (code, signal) => {
        hasExited = true;
        if (!processError) {
          processError = new Error(`Dev server exited during startup with code ${code}, signal ${signal}`);
          console.error('[Dev Build Test] Process exited unexpectedly:', processError.message);
        }
      });

      // Wait for server to respond on the port
      console.log(`[Dev Build Test] Waiting for server on port ${port}...`);
      const serverReady = await waitForPort(port, 60000, () => hasExited || processError !== null);

      // Check if process crashed during startup
      if (processError) {
        const output = outputChunks.join('');
        console.error('[Dev Build Test] Process error occurred:');
        console.error(output);
        throw processError;
      }

      if (!serverReady) {
        const output = outputChunks.join('');
        console.error('[Dev Build Test] Server did not start:');
        console.error(output);
        throw new Error(`Dev server did not respond on port ${port} within 60 seconds`);
      }

      console.log(`[Dev Build Test] Server ready on port ${port}`);

      // Verify we can actually fetch from it
      const response = await fetch(`http://localhost:${port}`);
      expect(response.status).toBeLessThan(500); // Any non-500 response is fine

      console.log(`[Dev Build Test] Successfully fetched from server, status: ${response.status}`);

    } finally {
      // Always kill the dev server
      if (devServer && !hasExited) {
        console.log(`[Dev Build Test] Stopping dev server...`);

        // Kill process (cross-platform - SIGTERM on Unix, force kill on Windows)
        devServer.kill();

        // Wait a moment for process to exit
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Double-check process is dead
        try {
          // Signal 0 checks if process exists without killing it
          process.kill(devServer.pid!, 0);
          // If we get here, process still exists - kill harder
          console.log(`[Dev Build Test] Process still alive, force terminating...`);
          // On Unix: SIGKILL, on Windows: this will throw (already killed by first kill())
          if (process.platform !== 'win32') {
            process.kill(devServer.pid!, 'SIGKILL');
          }
        } catch {
          // Process doesn't exist (expected)
          console.log(`[Dev Build Test] Dev server stopped`);
        }
      }
    }
  });
});
