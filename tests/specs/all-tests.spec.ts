// Full test suite - validates all scenarios
// Each test performs the ground truth action and verifies validation succeeds

import { test, expect } from '@playwright/test';
import { performGroundTruthAction, validateTest } from '../helpers/test-executor';
import { getAllScenarios } from '../helpers/scenario-loader';

// Load all scenarios
const allScenarios = getAllScenarios();

test.describe('Ground Truth Validation', () => {
  // Generate a test for each scenario
  for (const scenario of allScenarios) {
    // Skip ground truth testing for scenarios with detection_issue labels
    const hasDetectionIssue = scenario.labels.some(label => label.startsWith('detection_issue='));
    
    if (hasDetectionIssue) {
      test.skip(`${scenario.id}: ${scenario.title}`, async ({ page, baseURL }) => {
        // Skipped - detection_issue scenarios don't have reliable ground truth
      });
    } else {
      test(`${scenario.id}: ${scenario.title}`, async ({ page, baseURL }) => {
        if (!baseURL) {
          throw new Error('baseURL is required but was not provided');
        }

        // Perform ground truth action (based on scenario metadata)
        await performGroundTruthAction(page, scenario, baseURL);

        // Validate and assert success
        const passed = await validateTest(page, scenario.id);

        expect(passed,
          `Scenario ${scenario.id} should pass with ground truth action: ${scenario.expectedAction} on ${scenario.expectedTarget}`
        ).toBe(true);
      });
    }
  }
});
