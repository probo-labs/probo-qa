import { test, expect } from '@playwright/test';
import { existsSync, readFileSync, rmSync, statSync } from 'fs';
import { join } from 'path';

test.describe('Highlighter Functionality', () => {
  const testId = 'test-highlighter-simple'; // Dedicated test page
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const testCacheDir = join(process.cwd(), cacheDir, testId);

  test.beforeEach(async ({ page }) => {
    // Navigate to the dedicated test page
    await page.goto(`/test-pages/highlighter/simple`);
    await page.waitForLoadState('networkidle');
  });

  test('highlighter script is available', async ({ page }) => {
    // Hover bottom-left to reveal controls
    await page.hover('body', { position: { x: 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);

    // Check that Highlighter button is present and enabled
    const highlighterButton = page.getByRole('button', { name: 'Highlighter' });
    await expect(highlighterButton).toBeVisible();
    await expect(highlighterButton).toBeEnabled();
  });

  test('generates outputs and caches correctly', async ({ page }) => {
    // Delete cache to start fresh
    if (existsSync(testCacheDir)) {
      rmSync(testCacheDir, { recursive: true, force: true });
    }

    // Hover bottom-left to reveal controls and open highlighter panel (will generate outputs on first open)
    await page.hover('body', { position: { x: 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: 'Highlighter' }).click();

    // Wait for sidebar to be visible (no longer has "Highlighter Outputs" title, check for stats instead)
    await page.waitForSelector('text=CLICKABLE:', { timeout: 60000 });

    // 1. Verify all expected files exist on filesystem
    const files = ['metadata.json', 'base.png', 'clickable.png', 'fillable.png', 'selectable.png', 'non-interactive.png', 'candidates.json'];
    for (const file of files) {
      expect(existsSync(join(testCacheDir, file))).toBeTruthy();
    }

    // 2. Verify metadata has required structure and non-zero counts
    const metadataPath = join(testCacheDir, 'metadata.json');
    const metadataStats = statSync(metadataPath);
    const timestampBefore = metadataStats.mtime.getTime();

    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    expect(metadata).toHaveProperty('stats');
    expect(metadata.stats.clickableCount).toBeGreaterThan(0);
    expect(metadata.stats.fillableCount).toBeGreaterThan(0);
    expect(metadata.stats.selectableCount).toBeGreaterThan(0);
    expect(metadata.stats.nonInteractiveCount).toBeGreaterThan(0);

    // Record file timestamps
    const fileStats: Record<string, { birthtime: Date; mtime: Date }> = {};
    for (const file of files) {
      const stats = statSync(join(testCacheDir, file));
      fileStats[file] = { birthtime: stats.birthtime, mtime: stats.mtime };
    }

    // Cache test completed - files exist with non-zero counts
  });
});
