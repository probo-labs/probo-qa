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

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('probo-navbar-revealed');
    if (savedState === 'true') {
      setIsVisible(true);
    }
  }, []);

  // Listen for test automation events to show/hide navigation programmatically
  useEffect(() => {
    const handleShowNav = () => {
      setIsVisible(true);
      localStorage.setItem('probo-navbar-revealed', 'true');
    };

    const handleHideNav = () => {
      setIsVisible(false);
      localStorage.setItem('probo-navbar-revealed', 'false');
    };

    window.addEventListener('probo:showNavigation', handleShowNav);
    window.addEventListener('probo:hideNavigation', handleHideNav);

    return () => {
      window.removeEventListener('probo:showNavigation', handleShowNav);
      window.removeEventListener('probo:hideNavigation', handleHideNav);
    };
  }, []);

  const handleMouseEnter = () => {
    // Once navbar is revealed, it stays open and persists across navigation
    setIsVisible(true);
    localStorage.setItem('probo-navbar-revealed', 'true');
  };

  const handleHideClick = () => {
    setIsVisible(false);
    localStorage.setItem('probo-navbar-revealed', 'false');
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

      {/* Navigation - stays open once revealed, pinned to left edge */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 z-[1000]">
          <div className="relative">
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
            {/* Hide button in top-right of navbar */}
            <button
              onClick={handleHideClick}
              className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              title="Hide navigation (hover bottom-left to show again)"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
