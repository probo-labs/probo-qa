// Scenarios registry and search functions
// Central export for all scenario metadata

import type { Scenario } from '@/types/scenario';
import { scenarios as elementDensityScenarios } from './element-density';

// Aggregate all scenarios
export const SCENARIOS: Record<string, Scenario> = {
  ...elementDensityScenarios,
  // ...labelPositionScenarios,  // Will add later
  // ...widgetScenarios,         // Will add later
};

/**
 * Get a single scenario by ID
 */
export function getScenario(scenarioId: string): Scenario | undefined {
  return SCENARIOS[scenarioId];
}

/**
 * Get all scenario IDs
 */
export function getAllScenarioIds(): string[] {
  return Object.keys(SCENARIOS);
}

/**
 * Filter scenarios by a single label substring
 * @param labelQuery - Substring to match (e.g., 'element_density=sparse' or just 'sparse')
 */
export function filterByLabel(labelQuery: string): Scenario[] {
  return Object.values(SCENARIOS).filter(scenario =>
    scenario.labels.some(label => label.includes(labelQuery))
  );
}

/**
 * Filter scenarios that match ALL provided label queries (AND logic)
 * @param labelQueries - Array of label substrings
 */
export function filterByLabels(labelQueries: string[]): Scenario[] {
  return Object.values(SCENARIOS).filter(scenario =>
    labelQueries.every(query =>
      scenario.labels.some(label => label.includes(query))
    )
  );
}

/**
 * Group scenarios by a dimension (e.g., 'element_density')
 * Returns a map of dimension values to scenarios
 */
export function groupByDimension(dimension: string): Record<string, Scenario[]> {
  const grouped: Record<string, Scenario[]> = {};

  Object.values(SCENARIOS).forEach(scenario => {
    const label = scenario.labels.find(l => l.startsWith(`${dimension}=`));
    if (label) {
      const value = label.split('=')[1];
      if (!grouped[value]) {
        grouped[value] = [];
      }
      grouped[value].push(scenario);
    }
  });

  return grouped;
}

/**
 * Get all unique labels across all scenarios
 */
export function getAllLabels(): string[] {
  const labels = new Set<string>();
  Object.values(SCENARIOS).forEach(scenario => {
    scenario.labels.forEach(label => labels.add(label));
  });
  return Array.from(labels).sort();
}

/**
 * Get navigation context for a scenario (prev/next scenario IDs)
 */
export function getNavigationContext(scenarioId: string): {
  prevScenarioId: string | null;
  nextScenarioId: string | null;
  position: string;
} {
  const allIds = getAllScenarioIds();
  const currentIndex = allIds.indexOf(scenarioId);

  if (currentIndex === -1) {
    return {
      prevScenarioId: null,
      nextScenarioId: null,
      position: '?/?',
    };
  }

  return {
    prevScenarioId: currentIndex > 0 ? allIds[currentIndex - 1] : null,
    nextScenarioId: currentIndex < allIds.length - 1 ? allIds[currentIndex + 1] : null,
    position: `${currentIndex + 1}/${allIds.length}`,
  };
}
