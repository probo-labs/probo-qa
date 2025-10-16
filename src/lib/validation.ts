// Validation logic for scenario interactions
// Checks if recorded actions match expected behavior

import type { Scenario, ScenarioInteraction, ValidationResult } from '@/types/scenario';

/**
 * Validate recorded actions against scenario expectations
 *
 * Rules:
 * - Exactly ONE action must be recorded
 * - Action type must match expected action
 * - Element must match expected target
 *
 * @param scenario - Scenario metadata with expected behavior
 * @param actions - Recorded actions from database
 * @returns Validation result with pass/fail and message
 */
export function validateScenario(
  scenario: Scenario,
  actions: ScenarioInteraction[]
): ValidationResult {
  const actionCount = actions.length;

  // Rule 1: Must have exactly 1 action
  if (actionCount === 0) {
    return {
      pass: false,
      message: 'NO ACTIONS - No interaction recorded',
      actions,
      actionCount,
    };
  }

  if (actionCount > 1) {
    return {
      pass: false,
      message: `FAIL - Multiple actions recorded (${actionCount} actions, expected 1)`,
      actions,
      actionCount,
    };
  }

  // Rule 2 & 3: Check action type and element
  const action = actions[0];
  const isCorrectAction = action.actionPerformed === scenario.expectedAction;
  const isCorrectElement = action.elementInteracted === scenario.expectedTarget;

  if (isCorrectAction && isCorrectElement) {
    return {
      pass: true,
      message: 'PASS - Exactly one correct action',
      actions,
      actionCount,
    };
  }

  // Failed: wrong action or wrong element
  const expectedStr = `${scenario.expectedAction} on ${scenario.expectedTarget}`;
  const actualStr = `${action.actionPerformed} on ${action.elementInteracted}`;

  return {
    pass: false,
    message: `FAIL - Wrong action/element (expected ${expectedStr}, got ${actualStr})`,
    actions,
    actionCount,
  };
}
