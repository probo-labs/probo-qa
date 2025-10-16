'use client';

// Test Navigation Component
// Provides navigation links and reset functionality

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ScenarioNavigationProps {
  scenarioId: string;
  prevTestId?: string | null;
  nextTestId?: string | null;
  position?: string; // e.g., "1/35"
  mode?: 'test' | 'validation'; // Determines if we show VALIDATE or RETEST
  validationPageNav?: boolean; // If true, prev/next link to validation pages
  instructionHint?: string; // Optional instruction hint to display
}

export default function ScenarioNavigation({
  scenarioId,
  prevTestId,
  nextTestId,
  position,
  mode = 'test',
  validationPageNav = false,
  instructionHint
}: ScenarioNavigationProps) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);

    try {
      const response = await fetch(`/api/tests/${scenarioId}/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset test');
      }

      // Hard reload to clear state
      window.location.reload();
    } catch (err) {
      console.error('Failed to reset test:', err);
      setIsResetting(false);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const response = await fetch(`/api/tests/${scenarioId}/validate`);
      if (!response.ok) {
        throw new Error('Failed to validate test');
      }
      router.push(`/element-detection/${scenarioId}/validation`);
    } catch (err) {
      console.error('Failed to validate test:', err);
      setIsValidating(false);
    }
  };

  const handleRetest = async () => {
    setIsResetting(true);
    try {
      const response = await fetch(`/api/tests/${scenarioId}/reset`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to reset test');
      }
      router.push(`/element-detection/${scenarioId}`);
    } catch (err) {
      console.error('Failed to reset test:', err);
      setIsResetting(false);
    }
  };

  const prevUrl = validationPageNav
    ? `/element-detection/${prevTestId}/validation`
    : `/element-detection/${prevTestId}`;

  const nextUrl = validationPageNav
    ? `/element-detection/${nextTestId}/validation`
    : `/element-detection/${nextTestId}`;

  return (
    <>
      <div className="flex gap-1 items-center bg-white/95 px-1.5 py-1 rounded shadow-md text-[10px] font-sans">
        {/* Instruction Hint (if provided) */}
        {instructionHint && (
          <span className="text-orange-500 font-bold pr-2 border-r border-gray-300 mr-1 text-[9px]">
            {instructionHint}
          </span>
        )}

        {/* Test ID */}
        <span className="text-gray-600 font-medium font-mono pr-2 border-r border-gray-300 mr-1 text-[9px]">
          {scenarioId}
        </span>

        {/* Prev/Next */}
        {prevTestId ? (
          <Link
            href={prevUrl}
            className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[9px] hover:bg-gray-200 transition-colors"
            title="Previous test"
          >
            ←
          </Link>
        ) : (
          <span className="text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded text-[9px] cursor-not-allowed">
            ←
          </span>
        )}

        {position && (
          <span className="text-gray-600 px-1 text-[9px]">
            {position}
          </span>
        )}

        {nextTestId ? (
          <Link
            href={nextUrl}
            className="text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[9px] hover:bg-gray-200 transition-colors"
            title="Next test"
          >
            →
          </Link>
        ) : (
          <span className="text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded text-[9px] cursor-not-allowed">
            →
          </span>
        )}

        {/* Divider */}
        <div className="w-px h-3 bg-gray-300 mx-1" />

        {/* Show Reset only in test mode */}
        {mode === 'test' && (
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 px-1.5 py-0.5 rounded text-[9px] transition-colors"
          >
            {isResetting ? '...' : 'Reset'}
          </button>
        )}

        <Link
          href="/element-detection"
          className="text-gray-900 bg-white border border-gray-300 px-1.5 py-0.5 rounded text-[9px] font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          Index
        </Link>

        {/* Divider */}
        <div className="w-px h-3 bg-gray-300 mx-1" />

        {/* Action Button - VALIDATE or RETEST */}
        {mode === 'test' ? (
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="text-white bg-green-600 border border-green-600 px-1.5 py-0.5 rounded text-[9px] font-medium hover:bg-green-700 hover:border-green-700 disabled:bg-green-400 disabled:border-green-400 transition-colors"
          >
            {isValidating ? 'VALIDATING...' : 'VALIDATE'}
          </button>
        ) : (
          <button
            onClick={handleRetest}
            disabled={isResetting}
            className="text-white bg-green-600 border border-green-600 px-1.5 py-0.5 rounded text-[9px] font-medium hover:bg-green-700 hover:border-green-700 disabled:bg-green-400 disabled:border-green-400 transition-colors"
          >
            {isResetting ? 'RESETTING...' : 'RETEST'}
          </button>
        )}
      </div>
    </>
  );
}
