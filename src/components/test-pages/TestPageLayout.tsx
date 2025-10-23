'use client';

import { ReactNode, useState } from 'react';
import ScenarioNavigationWrapper from '@/app/element-detection/[scenarioId]/ScenarioNavigationWrapper';
import type { ScenarioInteraction } from '@/types/scenario';

interface TestPageLayoutProps {
  children: ReactNode;
  testId: string;
  title?: string;
  prevTestId?: string | null;
  nextTestId?: string | null;
  position?: string;
}

export default function TestPageLayout({
  children,
  testId,
  title,
  prevTestId = null,
  nextTestId = null,
  position,
}: TestPageLayoutProps) {
  const [interactions, setInteractions] = useState<ScenarioInteraction[]>([]);

  return (
    <>
      <div className="min-h-screen">
        {children}
      </div>

      <ScenarioNavigationWrapper
        scenarioId={testId}
        prevTestId={prevTestId}
        nextTestId={nextTestId}
        position={position || '1/1'}
        instructionHint={title || testId}
        interactions={interactions}
        onReset={() => setInteractions([])}
      />
    </>
  );
}
