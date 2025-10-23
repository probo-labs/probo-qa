import type { Page } from '@playwright/test';

export async function waitForRecordAPI(page: Page, scenarioId: string): Promise<void> {
  await page.waitForTimeout(200);
}
