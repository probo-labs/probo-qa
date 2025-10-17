import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
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
    // Hover bottom-right to reveal controls
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);

    // Check that Highlight button is present and enabled
    const highlightButton = page.getByRole('button', { name: /highlight/i }).first();
    await expect(highlightButton).toBeVisible();
    await expect(highlightButton).toBeEnabled();
  });

  test('can generate highlighter outputs', async ({ page }) => {
    // Hover to reveal controls
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);

    // Click Highlight button to generate outputs
    const highlightButton = page.getByRole('button', { name: /highlight/i }).first();
    await highlightButton.click();

    // Wait for generation to complete - generation may be very fast, so just wait for sidebar
    await expect(page.getByText('Highlighter Outputs')).toBeVisible({ timeout: 60000 });

    // Verify stats are shown
    await expect(page.getByText(/CLICKABLE:/)).toBeVisible();
    await expect(page.getByText(/FILLABLE:/)).toBeVisible();
    await expect(page.getByText(/SELECTABLE:/)).toBeVisible();
    await expect(page.getByText(/NON-INTERACTIVE:/)).toBeVisible();

    // Verify thumbnails are present
    await expect(page.getByText('Base (no highlights)')).toBeVisible();
  });

  test('outputs are cached on filesystem', async ({ page }) => {
    // Generate outputs first
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);

    const highlightButton = page.getByRole('button', { name: /highlight/i }).first();
    await highlightButton.click();
    await expect(page.getByText(/generating/i).first()).toBeHidden({ timeout: 60000 });

    // Check filesystem
    expect(existsSync(join(testCacheDir, 'metadata.json'))).toBeTruthy();
    expect(existsSync(join(testCacheDir, 'base.png'))).toBeTruthy();
    expect(existsSync(join(testCacheDir, 'clickable.png'))).toBeTruthy();
    expect(existsSync(join(testCacheDir, 'fillable.png'))).toBeTruthy();
    expect(existsSync(join(testCacheDir, 'selectable.png'))).toBeTruthy();
    expect(existsSync(join(testCacheDir, 'non-interactive.png'))).toBeTruthy();
    expect(existsSync(join(testCacheDir, 'candidates.json'))).toBeTruthy();

    // Verify metadata structure
    const metadata = JSON.parse(readFileSync(join(testCacheDir, 'metadata.json'), 'utf8'));
    expect(metadata).toHaveProperty('generatedAt');
    expect(metadata).toHaveProperty('stats');
    expect(metadata.stats).toHaveProperty('clickableCount');
    expect(metadata.stats).toHaveProperty('fillableCount');
    expect(metadata.stats).toHaveProperty('selectableCount');
    expect(metadata.stats).toHaveProperty('nonInteractiveCount');
  });

  test('cached outputs are reused on reload', async ({ page }) => {
    // Generate outputs
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /highlight/i }).first().click();
    await expect(page.getByText(/generating/i).first()).toBeHidden({ timeout: 60000 });

    // Get timestamp of cached files
    const metadataBefore = JSON.parse(readFileSync(join(testCacheDir, 'metadata.json'), 'utf8'));
    const timestampBefore = metadataBefore.generatedAt;

    // Close sidebar
    await page.getByRole('button', { name: '✕' }).click();
    await expect(page.getByText('Highlighter Outputs')).toBeHidden();

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Open sidebar again - should use cached data
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /highlight/i }).first().click();

    // Sidebar should open immediately without generation
    await expect(page.getByText('Highlighter Outputs')).toBeVisible({ timeout: 2000 });

    // Verify timestamp didn't change (cached)
    const metadataAfter = JSON.parse(readFileSync(join(testCacheDir, 'metadata.json'), 'utf8'));
    expect(metadataAfter.generatedAt).toBe(timestampBefore);
  });

  test('regenerate updates cached outputs', async ({ page }) => {
    // Generate initial outputs
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /highlight/i }).first().click();
    await expect(page.getByText('Highlighter Outputs')).toBeVisible({ timeout: 60000 });

    const metadataBefore = JSON.parse(readFileSync(join(testCacheDir, 'metadata.json'), 'utf8'));
    const timestampBefore = metadataBefore.generatedAt;

    // Wait enough time to ensure timestamp will be different (millisecond precision)
    await page.waitForTimeout(2000);

    // Click Rerun Highlight and wait for regeneration
    await page.getByRole('button', { name: /rerun highlight/i }).click();

    // Wait for stats to potentially update (they re-render with new data)
    await page.waitForTimeout(3000);

    // Poll filesystem until timestamp changes (max 60 seconds)
    let metadataAfter;
    let attempts = 0;
    while (attempts < 60) {
      metadataAfter = JSON.parse(readFileSync(join(testCacheDir, 'metadata.json'), 'utf8'));
      if (metadataAfter.generatedAt > timestampBefore) {
        break;
      }
      await page.waitForTimeout(1000);
      attempts++;
    }

    // Verify timestamp changed
    expect(metadataAfter!.generatedAt).toBeGreaterThan(timestampBefore);

    // Verify sidebar stayed open
    await expect(page.getByText('Highlighter Outputs')).toBeVisible();
  });

  test('candidates JSON has expected structure', async ({ page }) => {
    // Generate outputs
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /highlight/i }).first().click();
    await expect(page.getByText(/generating/i).first()).toBeHidden({ timeout: 60000 });

    // Read candidates JSON
    const candidates = JSON.parse(readFileSync(join(testCacheDir, 'candidates.json'), 'utf8'));

    // Verify structure
    expect(candidates).toHaveProperty('viewport');
    expect(candidates.viewport).toHaveProperty('width');
    expect(candidates.viewport).toHaveProperty('height');
    expect(candidates.viewport).toHaveProperty('timestamp');

    // Verify element type arrays exist
    expect(candidates).toHaveProperty('CLICKABLE');
    expect(candidates).toHaveProperty('FILLABLE');
    expect(candidates).toHaveProperty('SELECTABLE');
    expect(candidates).toHaveProperty('NON_INTERACTIVE_ELEMENT');

    // Verify at least some elements were found
    const totalElements =
      (candidates.CLICKABLE?.length || 0) +
      (candidates.FILLABLE?.length || 0) +
      (candidates.SELECTABLE?.length || 0) +
      (candidates.NON_INTERACTIVE_ELEMENT?.length || 0);
    expect(totalElements).toBeGreaterThan(0);
  });

  test('detects correct element counts on test page', async ({ page }) => {
    // Generate outputs
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /highlight/i }).first().click();
    await expect(page.getByText('Highlighter Outputs')).toBeVisible({ timeout: 60000 });

    // Read metadata
    const metadata = JSON.parse(readFileSync(join(testCacheDir, 'metadata.json'), 'utf8'));

    // Verify expected counts
    // CLICKABLE: 3 from test page (2 buttons + 1 link) + 1 select + 2 Next.js dev tools = 6
    // FILLABLE: 2 (1 input + 1 textarea)
    // SELECTABLE: 1 select + 1 Next.js dev tools button (wrongly categorized) = 2
    // NON_INTERACTIVE: h1, h2s, p, span, hover trigger div, etc.
    expect(metadata.stats.clickableCount).toBe(6);
    expect(metadata.stats.fillableCount).toBe(2);
    expect(metadata.stats.selectableCount).toBe(2); // Select appears in both clickable and selectable
    expect(metadata.stats.nonInteractiveCount).toBeGreaterThan(0);
  });

  test('collapsible JSON viewer works', async ({ page }) => {
    // Generate outputs
    await page.hover('body', { position: { x: page.viewportSize()!.width - 10, y: page.viewportSize()!.height - 10 } });
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /highlight/i }).first().click();
    await expect(page.getByText(/generating/i).first()).toBeHidden({ timeout: 60000 });

    // Click on Candidates JSON thumbnail
    await page.getByText('📄 Candidates JSON').click();

    // Verify modal opened
    await expect(page.getByText('candidates.json')).toBeVisible();

    // Verify collapse/expand buttons present
    await expect(page.getByRole('button', { name: 'Expand All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse All' })).toBeVisible();

    // Test collapse all
    await page.getByRole('button', { name: 'Collapse All' }).click();
    await page.waitForTimeout(500);

    // Test expand all
    await page.getByRole('button', { name: 'Expand All' }).click();
    await page.waitForTimeout(500);

    // Close modal - use .last() to get the modal's close button (not sidebar's)
    await page.getByRole('button', { name: '✕' }).last().click();
    await expect(page.getByText('candidates.json')).toBeHidden();
  });
});
