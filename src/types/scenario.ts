// Core types for element detection test suite

// Action types that can be performed on elements
export type ActionType = 'FILL' | 'CLICK' | 'SELECT';

// Label format: dimension=value
// Examples: 'element_density=sparse', 'label_position=left'
export type ScenarioLabel = string;

// Scenario metadata for element detection testing
export interface Scenario {
  id: string;                    // 4-char hex: a3c9, 7f2e, etc.
  title: string;                 // Short title
  description: string;           // Single free-form description
  expectedAction: ActionType;    // Expected action type
  expectedTarget: string;        // Expected CSS selector or element ID
  labels: ScenarioLabel[];       // Formal dimension tags
}

// Recorded interaction from database
export interface ScenarioInteraction {
  id: string;
  scenarioId: string;
  sessionId: string;
  actionPerformed: ActionType;
  elementInteracted: string;
  valueFilled: string | null;
  isCorrect: boolean;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Validation result
export interface ValidationResult {
  pass: boolean;
  message: string;
  actions: ScenarioInteraction[];
  actionCount: number;
}
