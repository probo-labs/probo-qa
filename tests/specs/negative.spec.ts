// Negative Tests - Verify that the test system correctly detects failures
// These tests intentionally perform WRONG actions and verify they fail validation

import { test, expect } from '@playwright/test';
import { validateTest } from '../helpers/test-executor';
import { performWrongAction, navigateWithoutAction } from '../helpers/negative-test-helpers';
import { getScenario } from '@/lib/scenarios';

// Scenario ID to use for negative tests
const SCENARIO_ID = 'a3c9';

// Run these tests serially to avoid session conflicts
test.describe.serial('Negative Tests - Failure Detection', () => {
  test('wrong action (click instead of fill) should fail validation', async ({ page, baseURL }) => {
    if (!baseURL) {
      throw new Error('baseURL is required');
    }

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) {
      throw new Error(`Scenario ${SCENARIO_ID} not found`);
    }

    // Expected action is FILL on #newsletter-email
    // But we'll intentionally CLICK on #submit-button (wrong action AND wrong element)
    await performWrongAction(page, baseURL, SCENARIO_ID, '#submit-button');

    // Validate - this should FAIL
    const passed = await validateTest(page, SCENARIO_ID);

    // Assert that validation correctly detected the wrong action
    expect(passed, 'Validation should fail when wrong action is performed').toBe(false);
  });

  test('wrong element (contact link instead of email) should fail validation', async ({ page, baseURL }) => {
    if (!baseURL) {
      throw new Error('baseURL is required');
    }

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) {
      throw new Error(`Scenario ${SCENARIO_ID} not found`);
    }

    // Expected action is FILL on #newsletter-email
    // But we'll CLICK on #contact-link (wrong element)
    await performWrongAction(page, baseURL, SCENARIO_ID, '#contact-link');

    // Validate - this should FAIL
    const passed = await validateTest(page, SCENARIO_ID);

    // Assert that validation correctly detected the wrong element
    expect(passed, 'Validation should fail when wrong element is interacted with').toBe(false);
  });

  test('no action should fail validation', async ({ page, baseURL }) => {
    if (!baseURL) {
      throw new Error('baseURL is required');
    }

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) {
      throw new Error(`Scenario ${SCENARIO_ID} not found`);
    }

    // Navigate to test page without performing any action
    await navigateWithoutAction(page, baseURL, SCENARIO_ID);

    // Validate - this should FAIL (no actions recorded)
    const passed = await validateTest(page, SCENARIO_ID);

    // Assert that validation correctly detected no action
    expect(passed, 'Validation should fail when no action is performed').toBe(false);
  });

  test('data-test-result attribute reflects failure correctly', async ({ page, baseURL }) => {
    if (!baseURL) {
      throw new Error('baseURL is required');
    }

    const scenario = getScenario(SCENARIO_ID);
    if (!scenario) {
      throw new Error(`Scenario ${SCENARIO_ID} not found`);
    }

    // Navigate and perform wrong action
    await performWrongAction(page, baseURL, SCENARIO_ID, '#submit-button');

    // Programmatically show navigation (for test automation)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('probo:showNavigation'));
    });

    // Wait for validation button (now shows VALIDATE) and click it
    await page.waitForSelector('button:has-text("VALIDATE")', { state: 'visible', timeout: 10000 });
    await page.click('button:has-text("VALIDATE")');

    // Wait for validation sidebar to appear
    await page.waitForSelector('[data-test-result]', { state: 'visible', timeout: 10000 });

    // Check that data-test-result attribute is "fail"
    const resultAttr = await page.getAttribute('[data-test-result]', 'data-test-result');
    expect(resultAttr, 'data-test-result should be "fail"').toBe('fail');
  });
});
