// Scenarios registry and search functions
// Central export for all scenario metadata

import type { Scenario } from '@/types/scenario';
import { scenarios as elementDensityScenarios } from './element-density';
import { scenarios as labelPositionScenarios } from './label-position';

// Aggregate all scenarios - ordered by density for sequential index numbering
export const SCENARIOS: Record<string, Scenario> = {
  // Sparse scenarios (indices 1-7)
  'a3c9': elementDensityScenarios['a3c9'],
  'd4a1': labelPositionScenarios['d4a1'],
  'e8b2': labelPositionScenarios['e8b2'],
  'f3c5': labelPositionScenarios['f3c5'],
  'a7d4': labelPositionScenarios['a7d4'],
  'b9e6': labelPositionScenarios['b9e6'],
  'c2f8': labelPositionScenarios['c2f8'],

  // Moderate scenarios (indices 8-14)
  '7f2e': elementDensityScenarios['7f2e'],
  'd5a2': labelPositionScenarios['d5a2'],
  'e9b3': labelPositionScenarios['e9b3'],
  'f4c6': labelPositionScenarios['f4c6'],
  'a8d5': labelPositionScenarios['a8d5'],
  'bae7': labelPositionScenarios['bae7'],
  'c3f9': labelPositionScenarios['c3f9'],

  // Dense scenarios (indices 15-21)
  'b5d1': elementDensityScenarios['b5d1'],
  'd6a3': labelPositionScenarios['d6a3'],
  'eab4': labelPositionScenarios['eab4'],
  'f5c7': labelPositionScenarios['f5c7'],
  'a9d6': labelPositionScenarios['a9d6'],
  'bbe8': labelPositionScenarios['bbe8'],
  'c4fa': labelPositionScenarios['c4fa'],

  // Extreme-dense scenarios (indices 22-28)
  'c8f3': elementDensityScenarios['c8f3'],
  'd7a4': labelPositionScenarios['d7a4'],
  'ecb5': labelPositionScenarios['ecb5'],
  'f6c8': labelPositionScenarios['f6c8'],
  'aad7': labelPositionScenarios['aad7'],
  'bce9': labelPositionScenarios['bce9'],
  'c5fb': labelPositionScenarios['c5fb'],

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
