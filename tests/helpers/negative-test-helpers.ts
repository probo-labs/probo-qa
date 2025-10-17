import type { Page } from '@playwright/test';
import { waitForRecordAPI } from './api-helpers';

export async function performWrongAction(
  page: Page,
  baseURL: string,
  scenarioId: string,
  wrongSelector: string
): Promise<void> {
  await page.goto(`${baseURL}/element-detection/${scenarioId}`);
  await page.waitForLoadState('networkidle');
  await page.click(wrongSelector);
  await waitForRecordAPI(page, scenarioId);
  await page.evaluate(() => window.dispatchEvent(new Event('probo:showNavigation')));
  await page.waitForSelector('text=/\\d+ action/', { timeout: 5000 });
}

export async function navigateWithoutAction(
  page: Page,
  baseURL: string,
  scenarioId: string
): Promise<void> {
  await page.goto(`${baseURL}/element-detection/${scenarioId}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.dispatchEvent(new Event('probo:showNavigation')));
  await page.waitForSelector('button:has-text("VALIDATE")', { timeout: 5000 });
}
