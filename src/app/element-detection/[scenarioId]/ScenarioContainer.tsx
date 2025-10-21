'use client';

import { useState } from 'react';
import type { Scenario, ScenarioInteraction, ActionType } from '@/types/scenario';
import ScenarioPageClient from './ScenarioPageClient';
import ScenarioNavigationWrapper from './ScenarioNavigationWrapper';

interface ScenarioContainerProps {
  scenarioId: string;
  scenario: Scenario;
  prevTestId: string | null;
  nextTestId: string | null;
  position: string;
  instructionHint: string;
}

export default function ScenarioContainer({
  scenarioId,
  scenario,
  prevTestId,
  nextTestId,
  position,
  instructionHint,
}: ScenarioContainerProps) {
  const [interactions, setInteractions] = useState<ScenarioInteraction[]>([]);

  const recordAction = (action: ActionType, element: string) => {
    const newInteraction: ScenarioInteraction = {
      id: crypto.randomUUID(),
      scenarioId,
      sessionId: 'client',
      actionPerformed: action,
      elementInteracted: element,
      valueFilled: null,
      timestamp: new Date(),
    };

    setInteractions(prev => [...prev, newInteraction]);
  };

  const resetInteractions = () => {
    setInteractions([]);
  };

  return (
    <>
      <ScenarioPageClient
        scenarioId={scenarioId}
        onAction={recordAction}
      />

      <ScenarioNavigationWrapper
        scenarioId={scenarioId}
        prevTestId={prevTestId}
        nextTestId={nextTestId}
        position={position}
        instructionHint={instructionHint}
        scenario={scenario}
        interactions={interactions}
        onReset={resetInteractions}
      />
    </>
  );
}
