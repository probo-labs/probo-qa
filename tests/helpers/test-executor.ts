// Test executor - performs ground truth actions and validates test results

import type { Page } from '@playwright/test';
import type { Scenario } from '@/types/scenario';
import { waitForRecordAPI } from './api-helpers';

/**
 * Perform the ground truth action for a scenario
 * @param page - Playwright page object
 * @param scenario - Scenario metadata
 * @param baseURL - Base URL (required)
 */
export async function performGroundTruthAction(
  page: Page,
  scenario: Scenario,
  baseURL: string
): Promise<void> {
  // Navigate to test page
  await page.goto(`${baseURL}/element-detection/${scenario.id}`);

  // Wait for page to be ready (networkidle ensures React hydration is complete)
  await page.waitForLoadState('networkidle');

  // Perform action based on expectedAction type
  const selector = `#${scenario.expectedTarget}`;

  switch (scenario.expectedAction) {
    case 'FILL':
      // Focus on input element (triggers recording)
      await page.focus(selector);
      await waitForRecordAPI(page, scenario.id);
      break;

    case 'CLICK':
      // Click on element (triggers recording)
      await page.click(selector);
      await waitForRecordAPI(page, scenario.id);
      break;

    case 'SELECT':
      // Select option from dropdown (triggers recording)
      await page.selectOption(selector, { index: 0 });
      await waitForRecordAPI(page, scenario.id);
      break;

    default:
      throw new Error(`Unknown action type: ${scenario.expectedAction}`);
  }
}

/**
 * Validate test results by clicking VALIDATE button and checking result
 * @param page - Playwright page object
 * @param scenarioId - Scenario ID
 * @returns true if validation passed, false otherwise
 * @throws Error if validation result element is not found
 */
export async function validateTest(
  page: Page,
  scenarioId: string
): Promise<boolean> {
  // Programmatically show navigation (for test automation)
  await page.evaluate(() => {
    window.dispatchEvent(new Event('probo:showNavigation'));
  });

  // Wait for validation button to appear (now always shows "VALIDATE")
  await page.waitForSelector('button:has-text("VALIDATE")', { state: 'visible', timeout: 10000 });

  // Click validation button to open sidebar
  await page.click('button:has-text("VALIDATE")');

  // Wait for validation sidebar to appear
  await page.waitForSelector('[data-test-result]', { state: 'visible', timeout: 10000 });

  // Check data-test-result attribute in the sidebar
  const resultElement = page.locator('[data-test-result]');
  const result = await resultElement.getAttribute('data-test-result');

  // Ensure element was found
  if (result === null) {
    throw new Error('Validation result element [data-test-result] not found in sidebar');
  }

  return result === 'pass';
}
