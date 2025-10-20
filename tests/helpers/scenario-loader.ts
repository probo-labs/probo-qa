import { getAllScenarioIds, getScenario } from '@/lib/scenarios';
import type { Scenario } from '@/types/scenario';

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
