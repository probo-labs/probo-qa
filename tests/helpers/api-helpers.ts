// API interaction helpers for tests

import type { Page } from '@playwright/test';

/**
 * Wait for the record API call to complete after an action
 * This helper ensures that user interactions have been recorded by the backend
 * before proceeding with validation.
 *
 * @param page - Playwright page object
 * @param scenarioId - Scenario ID
 */
export async function waitForRecordAPI(page: Page, scenarioId: string): Promise<void> {
  await page.waitForResponse(
    (response) =>
      response.url().includes(`/api/tests/${scenarioId}/record`) &&
      response.status() === 200,
    { timeout: 5000 }
  );
}
