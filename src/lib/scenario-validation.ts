import { prisma } from './db';
import { getScenario } from './scenarios';
import { validateScenario } from './validation';
import type { ActionType, ScenarioInteraction, ValidationResult } from '@/types/scenario';

export function convertDbActionsToScenarioInteractions(
  dbActions: Array<{
    id: string;
    scenarioId: string;
    sessionId: string;
    actionPerformed: string;
    elementInteracted: string;
    valueFilled: string | null;
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
    timestamp: action.timestamp,
    metadata: action.metadata as Record<string, unknown> | undefined,
  }));
}

export async function validateAndUpdateScenario(
  scenarioId: string,
  sessionId: string
): Promise<ValidationResult> {
  const scenario = getScenario(scenarioId);
  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }

  const dbActions = await prisma.scenarioInteractionState.findMany({
    where: {
      scenarioId,
      sessionId,
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  const actions = convertDbActionsToScenarioInteractions(dbActions);
  return validateScenario(scenario, actions);
}
