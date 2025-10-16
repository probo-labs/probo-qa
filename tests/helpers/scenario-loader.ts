// Scenario loader - dynamically loads all scenarios from metadata

import { getAllScenarioIds, getScenario } from '@/lib/scenarios';
import type { Scenario } from '@/types/scenario';

/**
 * Get all scenarios for validation testing
 * @returns Array of all scenarios with metadata
 */
export function getAllScenarios(): Scenario[] {
  const allIds = getAllScenarioIds();

  return allIds.map(id => {
    const scenario = getScenario(id);
    if (!scenario) {
      throw new Error(`Scenario not found: ${id}`);
    }
    return scenario;
  });
}
