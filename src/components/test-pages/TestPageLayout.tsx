'use client';

// Reusable layout for test pages with highlighter support
// Provides standard navigation controls that don't interfere with highlighting

import { ReactNode } from 'react';
import ScenarioNavigationWrapper from '@/app/element-detection/[scenarioId]/ScenarioNavigationWrapper';

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
  return (
    <>
      {/* Clean test content */}
      <div className="min-h-screen">
        {children}
      </div>

      {/* Standard navigation wrapper - only in DOM on hover */}
      <ScenarioNavigationWrapper
        scenarioId={testId}
        prevTestId={prevTestId}
        nextTestId={nextTestId}
        position={position || '1/1'}
        instructionHint={title || testId}
      />
    </>
  );
}
