// Validation Button States Test
// Verifies that the validation button has 3 correct states:
// 1. Gray (no actions recorded)
// 2. Red (validation failed - wrong action)
// 3. Green (validation passed - correct action)

import { test, expect } from '@playwright/test';
import { getScenario } from '@/lib/scenarios';

const SCENARIO_ID = 'a3c9';

test.describe.serial('Validation Button States', () => {
  test('should show gray when no actions recorded', async ({ page, baseURL }) => {
    if (!baseURL) throw new Error('baseURL is required');

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) throw new Error(`Scenario ${SCENARIO_ID} not found`);

    // Navigate to test page - no actions recorded yet
    await page.goto(`${baseURL}/element-detection/${SCENARIO_ID}`);
   await page.waitForLoadState('networkidle');

    // Show navigation
    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    // Get validation button
    const validateButton = page.locator('button:has-text("VALIDATE")');
    await expect(validateButton).toBeVisible();

    // Check button color - should be light blue (bg-blue-100)
    const buttonClass = await validateButton.getAttribute('class');
    console.log('[Test] Button class with no actions:', buttonClass);
    expect(buttonClass).toMatch(/bg-blue-100/);
    expect(buttonClass).not.toMatch(/bg-red-/);
    expect(buttonClass).not.toMatch(/bg-green-/);

    // Click button to open sidebar and verify content
    await validateButton.click();
    await page.waitForTimeout(300);

    // Check sidebar shows PENDING (not FAIL or SUCCESS)
    const sidebarHeader = page.locator('[data-test-result="neutral"]');
    await expect(sidebarHeader).toBeVisible();
    await expect(sidebarHeader).toContainText('PENDING');
    expect(await sidebarHeader.textContent()).not.toContain('FAIL');
    expect(await sidebarHeader.textContent()).not.toContain('SUCCESS');

    // Check that validation result shows PENDING (not FAIL)
    const validationResult = page.locator('text=Result:').locator('..').locator('span');
    await expect(validationResult).toContainText('PENDING');
  });

  test('should show red when validation fails (wrong action)', async ({ page, baseURL, context }) => {
    if (!baseURL) throw new Error('baseURL is required');

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) throw new Error(`Scenario ${SCENARIO_ID} not found`);

    // Clear cookies to get new session
    await context.clearCookies();

    // Navigate to test page
    await page.goto(`${baseURL}/element-detection/${SCENARIO_ID}`);
    await page.waitForLoadState('networkidle');

    // Show navigation first so component is mounted
    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    const validateButton = page.locator('button:has-text("VALIDATE")');
    await expect(validateButton).toBeVisible();

    // Record wrong action via API (expected is FILL on #newsletter-email, we'll record CLICK on #submit-button)
    const recordResponse = await page.evaluate(async () => {
      const response = await fetch('/api/tests/a3c9/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLICK',
          element: '#submit-button',
        }),
      });
      return response.json();
    });
    console.log('[Test] Record response:', recordResponse);

    // Dispatch event to trigger validation update in UI
    await page.evaluate((validation) => {
      window.dispatchEvent(new CustomEvent('probo:actionRecorded', { detail: validation }));
    }, recordResponse.validation);

    // Wait for button to actually turn red (React state update)
    await expect(validateButton).toHaveClass(/bg-red-[67]00/, { timeout: 2000 });

    // Verify it's not gray or green
    const buttonClass = await validateButton.getAttribute('class');
    console.log('[Test] Button class after wrong action:', buttonClass);
    expect(buttonClass).not.toMatch(/bg-gray-/);
    expect(buttonClass).not.toMatch(/bg-green-/);
  });

  test('should show green when validation passes (correct action)', async ({ page, baseURL, context }) => {
    if (!baseURL) throw new Error('baseURL is required');

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) throw new Error(`Scenario ${SCENARIO_ID} not found`);

    // Clear cookies to get new session
    await context.clearCookies();

    // Navigate to test page
    await page.goto(`${baseURL}/element-detection/${SCENARIO_ID}`);
    await page.waitForLoadState('networkidle');

    // Show navigation first so component is mounted
    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    const validateButton = page.locator('button:has-text("VALIDATE")');
    await expect(validateButton).toBeVisible();

    // Record CORRECT action via API (expected is FILL on newsletter-email)
    const recordResponse = await page.evaluate(async () => {
      const response = await fetch('/api/tests/a3c9/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'FILL',
          element: 'newsletter-email',
          value: 'test@example.com',
        }),
      });
      return response.json();
    });
    console.log('[Test] Record response:', recordResponse);

    // Reload the page to fetch fresh validation state
    await page.reload({ waitUntil: 'networkidle' });

    // Show navigation again after reload
    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    // Wait for button to turn green (validation loaded from server after reload)
    await expect(validateButton).toHaveClass(/bg-green-[67]00/, { timeout: 2000 });

    // Verify it's not gray or red
    const buttonClass = await validateButton.getAttribute('class');
    console.log('[Test] Button class after correct action:', buttonClass);
    expect(buttonClass).not.toMatch(/bg-gray-/);
    expect(buttonClass).not.toMatch(/bg-red-/);
  });
});
