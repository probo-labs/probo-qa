'use client';

// Wrapper that only renders navigation in DOM when hovering bottom-right corner
// This prevents hidden elements from being detected by the highlighter

import { useState, useEffect } from 'react';
import ScenarioNavigation from '@/components/element-detection/ScenarioNavigation';
import type { Scenario, ScenarioInteraction } from '@/types/scenario';

interface ScenarioNavigationWrapperProps {
  scenarioId: string;
  prevTestId: string | null;
  nextTestId: string | null;
  position: string;
  instructionHint: string;
  scenario?: Scenario;
  interactions: ScenarioInteraction[];
  onReset: () => void;
}

export default function ScenarioNavigationWrapper({
  scenarioId,
  prevTestId,
  nextTestId,
  position,
  instructionHint,
  scenario,
  interactions,
  onReset,
}: ScenarioNavigationWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Listen for test automation events to show/hide navigation programmatically
  useEffect(() => {
    const handleShowNav = () => {
      setIsVisible(true);
    };

    const handleHideNav = () => {
      setIsVisible(false);
    };

    window.addEventListener('probo:showNavigation', handleShowNav);
    window.addEventListener('probo:hideNavigation', handleHideNav);

    return () => {
      window.removeEventListener('probo:showNavigation', handleShowNav);
      window.removeEventListener('probo:hideNavigation', handleHideNav);
    };
  }, []);

  const handleMouseEnter = () => {
    // Once navbar is revealed, it stays open
    setIsVisible(true);
  };

  return (
    <>
      {/* Hover trigger - small corner area to activate */}
      {!isVisible && (
        <div
          className="fixed bottom-0 left-0 w-20 h-12 z-[1000]"
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* Navigation - stays open once revealed */}
      {isVisible && (
        <div className="fixed bottom-2.5 left-2.5 z-[1000]">
          <ScenarioNavigation
            scenarioId={scenarioId}
            prevTestId={prevTestId}
            nextTestId={nextTestId}
            position={position}
            mode="test"
            instructionHint={instructionHint}
            scenario={scenario}
            interactions={interactions}
            onReset={onReset}
          />
        </div>
      )}
    </>
  );
}
