// Helper functions for negative tests

import type { Page } from '@playwright/test';
import { waitForRecordAPI } from './api-helpers';

/**
 * Perform a wrong action on the test page
 * @param page - Playwright page object
 * @param baseURL - Base URL
 * @param scenarioId - Scenario ID
 * @param wrongSelector - Selector for wrong element to interact with
 */
export async function performWrongAction(
  page: Page,
  baseURL: string,
  scenarioId: string,
  wrongSelector: string
): Promise<void> {
  // Navigate to test page
  await page.goto(`${baseURL}/element-detection/${scenarioId}`);
  await page.waitForLoadState('networkidle');

  // Perform wrong action
  await page.click(wrongSelector);

  // Wait for the record API call
  await waitForRecordAPI(page, scenarioId);
}

/**
 * Navigate to test page without performing any action
 * @param page - Playwright page object
 * @param baseURL - Base URL
 * @param scenarioId - Scenario ID
 */
export async function navigateWithoutAction(
  page: Page,
  baseURL: string,
  scenarioId: string
): Promise<void> {
  await page.goto(`${baseURL}/element-detection/${scenarioId}`);
  await page.waitForLoadState('networkidle');
}
