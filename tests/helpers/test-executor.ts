import type { Page } from '@playwright/test';
import type { Scenario } from '@/types/scenario';
import { waitForRecordAPI } from './api-helpers';

export async function performGroundTruthAction(
  page: Page,
  scenario: Scenario,
  baseURL: string
): Promise<void> {
  await page.goto(`${baseURL}/element-detection/${scenario.id}`);
  await page.waitForLoadState('networkidle');

  const selector = `#${scenario.expectedTarget}`;

  switch (scenario.expectedAction) {
    case 'FILL':
      await page.focus(selector);
      break;
    case 'CLICK':
      await page.click(selector);
      break;
    case 'SELECT':
      await page.selectOption(selector, { index: 0 });
      break;
    default:
      throw new Error(`Unknown action type: ${scenario.expectedAction}`);
  }

  await waitForRecordAPI(page, scenario.id);

  await page.evaluate(() => window.dispatchEvent(new Event('probo:showNavigation')));
  await page.waitForSelector('text=/\\d+ action/', { timeout: 5000 });
}

export async function validateTest(page: Page, scenarioId: string): Promise<boolean> {
  await page.waitForSelector('button:has-text("VALIDATE")', { state: 'visible', timeout: 10000 });
  await page.click('button:has-text("VALIDATE")');
  await page.waitForSelector('[data-test-result]', { state: 'visible', timeout: 10000 });

  const result = await page.locator('[data-test-result]').getAttribute('data-test-result');
  if (result === null) {
    throw new Error('Validation result element [data-test-result] not found in sidebar');
  }

  return result === 'pass';
}
