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

    await page.goto(`${baseURL}/element-detection/${SCENARIO_ID}`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    const validateButton = page.locator('button:has-text("VALIDATE")');
    await expect(validateButton).toBeVisible();

    const buttonClass = await validateButton.getAttribute('class');
    console.log('[Test] Button class with no actions:', buttonClass);
    expect(buttonClass).toMatch(/bg-blue-100/);
    expect(buttonClass).not.toMatch(/bg-red-/);
    expect(buttonClass).not.toMatch(/bg-green-/);

    await validateButton.click();
    await page.waitForTimeout(300);

    const sidebarHeader = page.locator('[data-test-result="neutral"]');
    await expect(sidebarHeader).toBeVisible();
    await expect(sidebarHeader).toContainText('PENDING');
    expect(await sidebarHeader.textContent()).not.toContain('FAIL');
    expect(await sidebarHeader.textContent()).not.toContain('SUCCESS');

    const validationResult = page.locator('text=Result:').locator('..').locator('span');
    await expect(validationResult).toContainText('PENDING');
  });

  test('should show red when validation fails (wrong action)', async ({ page, baseURL, context }) => {
    if (!baseURL) throw new Error('baseURL is required');

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) throw new Error(`Scenario ${SCENARIO_ID} not found`);

    await context.clearCookies();

    await page.goto(`${baseURL}/element-detection/${SCENARIO_ID}`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    const validateButton = page.locator('button:has-text("VALIDATE")');
    await expect(validateButton).toBeVisible();

    await page.click('#submit-button');
    await page.waitForTimeout(300);

    await expect(validateButton).toHaveClass(/bg-red-[67]00/, { timeout: 2000 });

    const buttonClass = await validateButton.getAttribute('class');
    console.log('[Test] Button class after wrong action:', buttonClass);
    expect(buttonClass).not.toMatch(/bg-gray-/);
    expect(buttonClass).not.toMatch(/bg-green-/);
  });

  test('should show green when validation passes (correct action)', async ({ page, baseURL, context }) => {
    if (!baseURL) throw new Error('baseURL is required');

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) throw new Error(`Scenario ${SCENARIO_ID} not found`);

    await context.clearCookies();

    await page.goto(`${baseURL}/element-detection/${SCENARIO_ID}`);
    await page.waitForLoadState('networkidle');

    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    const validateButton = page.locator('button:has-text("VALIDATE")');
    await expect(validateButton).toBeVisible();

    await page.focus('#newsletter-email');
    await page.waitForTimeout(300);

    await expect(validateButton).toHaveClass(/bg-green-[67]00/, { timeout: 2000 });

    const buttonClass = await validateButton.getAttribute('class');
    console.log('[Test] Button class after correct action:', buttonClass);
    expect(buttonClass).not.toMatch(/bg-gray-/);
    expect(buttonClass).not.toMatch(/bg-red-/);
  });
});
