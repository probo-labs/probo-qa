// Shared Test Validation Service
// Consolidates validation logic used by both API routes and pages

import { prisma } from './db';
import { getScenario } from './scenarios';
import { validateScenario } from './validation';
import type { ActionType, ScenarioInteraction, ValidationResult } from '@/types/scenario';

/**
 * Converts database records to domain model ScenarioInteraction objects
 */
export function convertDbActionsToScenarioInteractions(
  dbActions: Array<{
    id: string;
    scenarioId: string;
    sessionId: string;
    actionPerformed: string;
    elementInteracted: string;
    valueFilled: string | null;
    isCorrect: boolean;
    timestamp: Date;
    metadata: unknown;
  }>
): ScenarioInteraction[] {
  return dbActions.map(action => ({
    id: action.id,
    scenarioId: action.scenarioId,
    sessionId: action.sessionId,
    actionPerformed: action.actionPerformed as ActionType,
    elementInteracted: action.elementInteracted,
    valueFilled: action.valueFilled,
    isCorrect: action.isCorrect,
    timestamp: action.timestamp,
    metadata: action.metadata as Record<string, unknown> | undefined,
  }));
}

/**
 * Fetches actions, validates them, and updates the database
 * This is the single source of truth for validation logic
 *
 * @param scenarioId - The scenario ID to validate
 * @param sessionId - The user's session ID
 * @returns ValidationResult with pass/fail status and actions
 * @throws Error if scenario not found
 */
export async function validateAndUpdateScenario(
  scenarioId: string,
  sessionId: string
): Promise<ValidationResult> {
  // Get scenario
  const scenario = getScenario(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }

  // Fetch all actions for this scenario + session
  const dbActions = await prisma.scenarioInteractionState.findMany({
    where: {
      scenarioId,
      sessionId,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  // Convert to domain model
  const actions = convertDbActionsToScenarioInteractions(dbActions);

  // Run validation logic
  const result = validateScenario(scenario, actions);

  // Update isCorrect field in database (only if there are actions)
  if (actions.length > 0) {
    await prisma.scenarioInteractionState.updateMany({
      where: {
        scenarioId,
        sessionId,
      },
      data: {
        isCorrect: result.pass,
      },
    });
  }

  return result;
}
