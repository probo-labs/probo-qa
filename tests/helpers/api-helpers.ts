import type { Page } from '@playwright/test';

export async function waitForRecordAPI(page: Page, scenarioId: string): Promise<void> {
  await page.waitForResponse(
    (response) => response.url().includes(`/api/tests/${scenarioId}/record`) && response.status() === 200,
    { timeout: 5000 }
  );
  await page.waitForTimeout(100);
}
