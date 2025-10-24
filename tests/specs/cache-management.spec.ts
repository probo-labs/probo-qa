import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

// Declare global window type for test hook
declare global {
  interface Window {
    __testFillCache?: (scenarioIds?: string[]) => Promise<void>;
  }
}

test.describe('Cache Management', () => {
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const cachePath = join(process.cwd(), cacheDir);

  test.beforeEach(async ({ page }) => {
    // Navigate to the element-detection index page
    await page.goto('/element-detection');
    await page.waitForLoadState('networkidle');
  });

  test('Delete Cache button clears all scenario caches', async ({ page }) => {
    // Create a dummy cache directory with a test file
    const testScenarioDir = join(cachePath, 'test-scenario-delete');
    mkdirSync(testScenarioDir, { recursive: true });
    writeFileSync(join(testScenarioDir, 'test.json'), '{"test": true}');

    // Verify the test file exists
    expect(existsSync(join(testScenarioDir, 'test.json'))).toBeTruthy();

    // Find and click the Delete Cache button
    const deleteButton = page.getByRole('button', { name: 'Delete Cache' });
    await expect(deleteButton).toBeVisible();
    await expect(deleteButton).toBeEnabled();

    // Handle the confirmation dialog
    page.once('dialog', dialog => dialog.accept());
    await deleteButton.click();

    // Wait for the success state
    await expect(page.getByRole('button', { name: /Deleted!/ })).toBeVisible({ timeout: 5000 });

    // Wait a bit for the file system operation to complete
    await page.waitForTimeout(500);

    // Verify the cache directory was deleted
    expect(existsSync(testScenarioDir)).toBeFalsy();
  });

  test('Fill Highlighter Cache button generates cache for scenarios', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds - only testing 2 scenarios

    // Clear cache before test
    if (existsSync(cachePath)) {
      rmSync(cachePath, { recursive: true, force: true });
    }

    // Use the test hook to fill cache for only 2 scenarios (fast)
    const testScenarios = ['a3c9', 'd4a1'];

    await page.evaluate((scenarios) => {
      window.__testFillCache?.(scenarios);
    }, testScenarios);

    // Wait for filling to start - button should show progress
    await expect(page.getByRole('button', { name: /Filling\.\.\./ })).toBeVisible({ timeout: 5000 });

    // Wait for completion (only 2 scenarios, should be quick)
    await expect(page.getByRole('button', { name: /Cache filled!/ })).toBeVisible({ timeout: 30000 });

    // Give it a moment for the success state to show
    await page.waitForTimeout(1000);

    // Verify that the test scenarios' caches were created
    const requiredFiles = [
      'metadata.json',
      'base.png',
      'clickable.png',
      'fillable.png',
      'selectable.png',
      'non-interactive.png',
      'candidates.json'
    ];

    for (const scenarioId of testScenarios) {
      const scenarioDir = join(cachePath, scenarioId);
      expect(existsSync(scenarioDir)).toBeTruthy();

      for (const file of requiredFiles) {
        expect(existsSync(join(scenarioDir, file))).toBeTruthy();
      }
    }
  });

  test('Fill Cache respects existing cache (does not regenerate)', async ({ page }) => {
    test.setTimeout(60000); // 60 seconds

    // Create a minimal dummy cache for one scenario
    const testScenarioId = 'a3c9';
    const testScenarioDir = join(cachePath, testScenarioId);
    mkdirSync(testScenarioDir, { recursive: true });

    // Create all required files with minimal content
    const timestamp = Date.now();
    writeFileSync(join(testScenarioDir, 'metadata.json'), JSON.stringify({
      generatedAt: timestamp,
      stats: { clickableCount: 1, fillableCount: 1, selectableCount: 1, nonInteractiveCount: 1 }
    }));
    writeFileSync(join(testScenarioDir, 'base.png'), Buffer.from('fake-image'));
    writeFileSync(join(testScenarioDir, 'clickable.png'), Buffer.from('fake-image'));
    writeFileSync(join(testScenarioDir, 'fillable.png'), Buffer.from('fake-image'));
    writeFileSync(join(testScenarioDir, 'selectable.png'), Buffer.from('fake-image'));
    writeFileSync(join(testScenarioDir, 'non-interactive.png'), Buffer.from('fake-image'));
    writeFileSync(join(testScenarioDir, 'candidates.json'), '{}');

    // Get the initial modification time
    const { statSync } = await import('fs');
    const initialMtime = statSync(join(testScenarioDir, 'metadata.json')).mtime.getTime();

    // Use test hook to fill cache for only this scenario
    await page.evaluate((scenarioId) => {
      window.__testFillCache?.([scenarioId]);
    }, testScenarioId);

    // Wait for completion
    await expect(page.getByRole('button', { name: /Cache filled!/ })).toBeVisible({ timeout: 30000 });

    // Wait a bit
    await page.waitForTimeout(1000);

    // Verify the file was NOT regenerated (mtime should be the same or very close)
    const finalMtime = statSync(join(testScenarioDir, 'metadata.json')).mtime.getTime();

    // The file should not have been modified (allowing 1 second tolerance for filesystem)
    expect(Math.abs(finalMtime - initialMtime)).toBeLessThan(1000);
  });
});
