'use client';

// Wrapper that only renders navigation in DOM when hovering bottom-right corner
// This prevents hidden elements from being detected by the highlighter

import { useState, useRef } from 'react';
import ScenarioNavigation from '@/components/element-detection/ScenarioNavigation';

interface ScenarioNavigationWrapperProps {
  scenarioId: string;
  prevTestId: string | null;
  nextTestId: string | null;
  position: string;
  instructionHint: string;
}

export default function ScenarioNavigationWrapper({
  scenarioId,
  prevTestId,
  nextTestId,
  position,
  instructionHint,
}: ScenarioNavigationWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Cancel any pending hide
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    // Only hide if not pinned, and with 10 second delay
    if (!isPinned) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        hideTimeoutRef.current = null;
      }, 10000); // 10 seconds
    }
  };

  const handleSidebarOpen = () => {
    setIsPinned(true);
  };

  const handleSidebarClose = () => {
    setIsPinned(false);
    setIsVisible(false);
  };

  return (
    <>
      {/* Hover trigger - small corner area to activate */}
      {!isVisible && !isPinned && (
        <div
          className="fixed bottom-0 right-0 w-20 h-12 z-[1000]"
          onMouseEnter={handleMouseEnter}
        />
      )}

      {/* Navigation wrapper - exact size of content when visible */}
      {isVisible && (
        <div
          className="fixed bottom-2.5 right-2.5 z-[1000]"
          onMouseLeave={handleMouseLeave}
        >
          <ScenarioNavigation
            scenarioId={scenarioId}
            prevTestId={prevTestId}
            nextTestId={nextTestId}
            position={position}
            mode="test"
            instructionHint={instructionHint}
            onSidebarOpen={handleSidebarOpen}
            onSidebarClose={handleSidebarClose}
          />
        </div>
      )}
    </>
  );
}
