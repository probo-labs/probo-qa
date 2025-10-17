'use client';

// Test Navigation Component
// Provides navigation links and reset functionality

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import type { TestCase, ValidationResult } from '@/types/scenario';

// Lazy load sidebars to reduce initial bundle size
const HighlighterSidebar = dynamic(() => import('./HighlighterSidebar'), { ssr: false });
const ValidationSidebar = dynamic(() => import('./ValidationSidebar'), { ssr: false });

interface ScenarioNavigationProps {
  scenarioId: string;
  prevTestId?: string | null;
  nextTestId?: string | null;
  position?: string; // e.g., "1/35"
  mode?: 'test' | 'validation'; // Determines if we show VALIDATE or RETEST
  validationPageNav?: boolean; // If true, prev/next link to validation pages
  instructionHint?: string; // Optional instruction hint to display
  scenario?: TestCase; // Optional scenario data for validation sidebar
  validationResult?: ValidationResult; // Optional validation result for validation page
}

export default function ScenarioNavigation({
  scenarioId,
  prevTestId,
  nextTestId,
  position,
  mode = 'test',
  validationPageNav = false,
  instructionHint,
  scenario,
  validationResult
}: ScenarioNavigationProps) {
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasOutputs, setHasOutputs] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showValidationSidebar, setShowValidationSidebar] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);
  const [validationData, setValidationData] = useState<any>(null);
  const [highlighterAvailable, setHighlighterAvailable] = useState(true);
  const [highlighterError, setHighlighterError] = useState('');

  // Check if highlighter script is available on mount
  useEffect(() => {
    fetch('/api/scenarios/check-highlighter')
      .then(r => r.json())
      .then(data => {
        setHighlighterAvailable(data.available);
        if (!data.available) {
          setHighlighterError(data.reason || 'Highlighter script not available');
        }
      })
      .catch(err => {
        console.error('Failed to check highlighter:', err);
        setHighlighterAvailable(false);
        setHighlighterError('Failed to check highlighter availability');
      });
  }, []);

  // Check if outputs exist on mount
  useEffect(() => {
    fetch(`/api/scenarios/${scenarioId}/outputs`)
      .then(r => r.json())
      .then(data => {
        setHasOutputs(data.exists);
        if (data.exists) {
          setMetadata(data);

          // Check if we should auto-open sidebar (after regenerate)
          if (sessionStorage.getItem('keepSidebarOpen') === 'true') {
            setShowSidebar(true);
            sessionStorage.removeItem('keepSidebarOpen');
          }
        }
      })
      .catch(err => console.error('Failed to check outputs:', err));
  }, [scenarioId]);

  // Fetch validation result on mount and when actions are recorded
  // Only in test mode and when scenario exists
  useEffect(() => {
    if (mode !== 'test' || !scenario) return;

    const fetchValidation = async () => {
      try {
        const response = await fetch(`/api/tests/${scenarioId}/validate`);
        if (response.ok) {
          const result = await response.json();
          setValidationData(result);
        }
      } catch (err) {
        // Silently fail - scenario may not exist
        console.debug('Validation not available:', err);
      }
    };

    // Fetch immediately on mount
    fetchValidation();

    // Listen for action recorded events and use the validation data from the event
    const handleActionRecorded = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        // Use validation data directly from the event (no extra fetch needed!)
        setValidationData(customEvent.detail);
      } else {
        // Fallback: fetch validation if no data in event
        fetchValidation();
      }
    };

    window.addEventListener('probo:actionRecorded', handleActionRecorded);

    return () => {
      window.removeEventListener('probo:actionRecorded', handleActionRecorded);
    };
  }, [scenarioId, mode, scenario]);

  const handleReset = async () => {
    setIsResetting(true);

    try {
      const response = await fetch(`/api/tests/${scenarioId}/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset test');
      }

      // Clear validation state immediately (no reload)
      setValidationData(null);

      // Fetch fresh validation (should show 0 actions)
      const validationResponse = await fetch(`/api/tests/${scenarioId}/validate`);
      if (validationResponse.ok) {
        const result = await validationResponse.json();
        setValidationData(result);
      }
    } catch (err) {
      console.error('Failed to reset test:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleReload = () => {
    // Hard reload to clear all form state (filled inputs, checkboxes, etc.)
    window.location.reload();
  };

  const handleValidate = async () => {
    // Just toggle validation sidebar - it will show current validation result
    setShowValidationSidebar(!showValidationSidebar);
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

  // Generate/use cache (called on first open if outputs don't exist)
  const handleGenerateOrUseCache = async (forceRegenerate = false) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/scenarios/${scenarioId}/generate-outputs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageUrl: window.location.href,
          forceRegenerate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outputs');
      }

      const data = await response.json();
      setMetadata(data);
      setHasOutputs(true);
    } catch (err) {
      console.error('Failed to generate outputs:', err);
      alert('Failed to generate outputs. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Highlighter button click - toggle highlighter panel (close validation if open)
  const handleHighlighterClick = () => {
    if (showSidebar) {
      // Already showing highlighter - close it
      setShowSidebar(false);
    } else {
      // Open highlighter - close validation if open, generate/use cache if needed
      setShowValidationSidebar(false);
      setShowSidebar(true);
      if (!hasOutputs) {
        handleGenerateOrUseCache(false);
      }
    }
  };

  // Handle Validate button click - toggle validation panel (close highlighter if open)
  const handleValidateClick = () => {
    if (showValidationSidebar) {
      // Already showing validation - close it
      setShowValidationSidebar(false);
    } else {
      // Open validation - close highlighter if open
      setShowSidebar(false);
      setShowValidationSidebar(true);
    }
  };

  const handleRegenerate = async () => {
    await handleGenerateOrUseCache(true); // Force regenerate
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

        <Link
          href="/element-detection"
          className="text-gray-900 bg-white border border-gray-300 px-1.5 py-0.5 rounded text-[9px] font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          Index
        </Link>

        {/* Show action count, Reload, and Reset only in test mode */}
        {mode === 'test' && (
          <>
            {/* Action count label */}
            {validationData?.actionCount !== undefined && (
              <span className="text-gray-600 px-1 text-[9px] font-mono">
                {validationData.actionCount} action{validationData.actionCount !== 1 ? 's' : ''}
              </span>
            )}

            <button
              onClick={handleReload}
              className="text-gray-900 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded text-[9px] transition-colors"
            >
              Reload
            </button>

            <button
              onClick={handleReset}
              disabled={isResetting}
              className="text-gray-900 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 px-1.5 py-0.5 rounded text-[9px] transition-colors"
            >
              {isResetting ? 'Resetting...' : 'Reset'}
            </button>
          </>
        )}

        {/* Divider */}
        <div className="w-px h-3 bg-gray-300 mx-1" />

        {/* Action Button - VALIDATE */}
        {mode === 'test' ? (
          <button
            onClick={handleValidateClick}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors border ${
              validationData?.actionCount === 0
                ? showValidationSidebar
                  ? 'bg-gray-700 text-white border-gray-700 hover:bg-gray-800'
                  : 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700'
                : showValidationSidebar
                ? validationData?.pass
                  ? 'bg-green-700 text-white border-green-700 hover:bg-green-800'
                  : 'bg-red-700 text-white border-red-700 hover:bg-red-800'
                : validationData?.pass
                ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                : 'bg-red-600 text-white border-red-600 hover:bg-red-700'
            }`}
            title={showValidationSidebar ? 'Close validation panel' : 'Open validation panel'}
          >
            VALIDATE
          </button>
        ) : (
          <button
            onClick={() => setShowValidationSidebar(!showValidationSidebar)}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors border ${
              validationResult?.actionCount === 0
                ? showValidationSidebar
                  ? 'bg-gray-700 text-white border-gray-700 hover:bg-gray-800'
                  : 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700'
                : showValidationSidebar
                ? validationResult?.pass
                  ? 'bg-green-700 text-white border-green-700 hover:bg-green-800'
                  : 'bg-red-700 text-white border-red-700 hover:bg-red-800'
                : validationResult?.pass
                ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                : 'bg-red-600 text-white border-red-600 hover:bg-red-700'
            }`}
            title={showValidationSidebar ? 'Close validation panel' : 'Open validation panel'}
          >
            VALIDATE
          </button>
        )}

        {/* Highlighter Button - Available in both test and validation modes */}
        <button
          onClick={handleHighlighterClick}
          disabled={!highlighterAvailable}
          className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${
            showSidebar
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'text-gray-900 bg-blue-100 hover:bg-blue-200'
          } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
          title={
            !highlighterAvailable
              ? highlighterError
              : showSidebar
              ? 'Close highlighter panel'
              : 'Open highlighter panel'
          }
        >
          Highlighter
        </button>
      </div>

      {/* Highlighter Sidebar */}
      {hasOutputs && (
        <HighlighterSidebar
          scenarioId={scenarioId}
          isOpen={showSidebar}
          metadata={metadata}
          onClose={() => {
            setShowSidebar(false);
          }}
          onRegenerate={handleRegenerate}
        />
      )}

      {/* Validation Sidebar - in test mode with fetched data, or validation mode with passed data */}
      {((mode === 'test' && validationData && scenario) || (mode === 'validation' && validationResult && scenario)) && (
        <ValidationSidebar
          scenarioId={scenarioId}
          scenario={scenario!}
          result={mode === 'test' ? validationData : validationResult!}
          isOpen={mode === 'test' ? showValidationSidebar : true}
          onClose={() => {
            if (mode === 'test') {
              setShowValidationSidebar(false);
            }
          }}
        />
      )}
    </>
  );
}
