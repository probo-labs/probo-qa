'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Scenario, ValidationResult, ScenarioInteraction } from '@/types/scenario';
import { validateScenario } from '@/lib/validation';

const HighlighterSidebar = dynamic(() => import('./HighlighterSidebar'), { ssr: false });
const ValidationSidebar = dynamic(() => import('./ValidationSidebar'), { ssr: false });

interface ScenarioNavigationProps {
  scenarioId: string;
  prevTestId?: string | null;
  nextTestId?: string | null;
  position?: string;
  mode?: 'test' | 'validation';
  validationPageNav?: boolean;
  instructionHint?: string;
  scenario?: Scenario;
  validationResult?: ValidationResult;
  interactions?: ScenarioInteraction[];
  onReset?: () => void;
}

interface MetadataType {
  exists: boolean;
  generatedAt: number;
  stats: {
    clickableCount: number;
    fillableCount: number;
    selectableCount: number;
    nonInteractiveCount: number;
  };
}

const SIDEBAR_STORAGE_KEY = 'keepSidebarOpen';
const BASE_BTN = 'px-1.5 py-0.5 rounded transition-colors';
const BTN_SMALL = 'text-[9px]';
const BTN_GRAY = `${BASE_BTN} ${BTN_SMALL} text-gray-900 bg-gray-100 hover:bg-gray-200`;
const BTN_DISABLED = 'disabled:bg-gray-50 disabled:text-gray-400';
const NAV_DISABLED = `${BTN_SMALL} text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded cursor-not-allowed`;

const getValidateButtonClass = (status: 'neutral' | 'pass' | 'fail' | undefined, isOpen: boolean) => {
  const base = `${BASE_BTN} ${BTN_SMALL} font-medium border`;

  if (isOpen) {
    return `${base} bg-blue-600 text-white hover:bg-blue-700 border-blue-600`;
  }

  if (status === 'pass') {
    return `${base} text-white bg-green-600 border-green-600 hover:bg-green-700`;
  }

  if (status === 'fail') {
    return `${base} text-white bg-red-600 border-red-600 hover:bg-red-700`;
  }

  return `${base} text-gray-900 bg-blue-100 hover:bg-blue-200 border-blue-100`;
};

const getHighlighterButtonClass = (isOpen: boolean, isAvailable: boolean) => {
  if (!isAvailable) return `${BASE_BTN} ${BTN_SMALL} bg-gray-100 text-gray-400 cursor-not-allowed`;
  return `${BASE_BTN} ${BTN_SMALL} ${isOpen ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-900 bg-blue-100 hover:bg-blue-200'}`;
};

const NavLink = ({ testId, validationNav, direction }: { testId: string | null | undefined; validationNav: boolean; direction: 'prev' | 'next' }) => {
  const arrow = direction === 'prev' ? '←' : '→';
  const title = direction === 'prev' ? 'Previous test' : 'Next test';

  if (!testId) return <span className={NAV_DISABLED}>{arrow}</span>;

  const href = validationNav ? `/element-detection/${testId}/validation` : `/element-detection/${testId}`;
  return <Link href={href} className={BTN_GRAY} title={title}>{arrow}</Link>;
};

export default function ScenarioNavigation({
  scenarioId,
  prevTestId,
  nextTestId,
  position,
  mode = 'test',
  validationPageNav = false,
  instructionHint,
  scenario,
  validationResult,
  interactions = [],
  onReset
}: ScenarioNavigationProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [hasOutputs, setHasOutputs] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showValidationSidebar, setShowValidationSidebar] = useState(false);
  const [metadata, setMetadata] = useState<MetadataType | null>(null);
  const [validationData, setValidationData] = useState<ValidationResult | null>(null);
  const [highlighterAvailable, setHighlighterAvailable] = useState(true);
  const [highlighterError, setHighlighterError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetch('/api/scenarios/check-highlighter')
      .then(r => r.json())
      .then(data => {
        setHighlighterAvailable(data.available);
        if (!data.available) setHighlighterError(data.reason || 'Highlighter script not available');
      })
      .catch(() => {
        setHighlighterAvailable(false);
        setHighlighterError('Failed to check highlighter availability');
      });
  }, []);

  useEffect(() => {
    fetch(`/api/scenarios/${scenarioId}/outputs`)
      .then(r => r.json())
      .then(data => {
        setHasOutputs(data.exists);
        if (data.exists) {
          setMetadata(data);
          if (sessionStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true') {
            setShowSidebar(true);
            sessionStorage.removeItem(SIDEBAR_STORAGE_KEY);
          }
        }
      })
      .catch(err => console.error('Failed to check outputs:', err));
  }, [scenarioId]);

  useEffect(() => {
    if (mode !== 'test' || !scenario) return;

    const result = validateScenario(scenario, interactions);
    setValidationData(result);
  }, [interactions, scenario, mode]);

  const handleReset = () => {
    if (onReset) {
      setIsResetting(true);
      onReset();
      setTimeout(() => setIsResetting(false), 100);
    }
  };

  const handleGenerateOrUseCache = async (forceRegenerate = false) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/scenarios/${scenarioId}/generate-outputs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageUrl: window.location.href, forceRegenerate }),
      });

      if (!response.ok) throw new Error('Failed to generate outputs');

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

  const handleHighlighterClick = () => {
    const willOpen = !showSidebar;
    setShowSidebar(willOpen);
    if (willOpen) {
      setShowValidationSidebar(false);
      if (!hasOutputs) handleGenerateOrUseCache(false);
    }
  };

  const handleValidateClick = () => {
    const willOpen = !showValidationSidebar;
    setShowValidationSidebar(willOpen);
    if (willOpen) setShowSidebar(false);
  };

  const isTestMode = mode === 'test';
  const currentValidation = isTestMode ? validationData : validationResult;
  const hasValidation = !!currentValidation && !!scenario;

  return (
    <>
      <div className="flex gap-1 items-center bg-white/95 px-1.5 py-1 shadow-md text-[10px] font-sans">
        <Link href="/element-detection" className={`${BASE_BTN} ${BTN_SMALL} text-gray-900 bg-white border border-gray-300 font-medium hover:bg-gray-50 hover:border-gray-400`}>
          Index
        </Link>

        <div className="w-px h-3 bg-gray-300 mx-1" />

        <NavLink testId={prevTestId} validationNav={validationPageNav} direction="prev" />
        {position && <span className={`${BTN_SMALL} text-gray-600 px-1 inline-block text-center font-mono`} style={{ width: '42px' }}>{position}</span>}
        <NavLink testId={nextTestId} validationNav={validationPageNav} direction="next" />

        <div className="w-px h-3 bg-gray-300 mx-1" />

        <span className={`${BTN_SMALL} text-gray-600 font-medium font-mono pr-2 border-r border-gray-300 mr-1`}>
          {scenarioId}
        </span>

        {instructionHint && (
          <span className={`${BTN_SMALL} text-orange-500 font-bold pr-2 border-r border-gray-300 mr-1`}>
            {instructionHint}
          </span>
        )}

        {isTestMode && (
          <>
            {validationData?.actionCount !== undefined && (
              <span className={`${BTN_SMALL} text-gray-600 px-1 font-mono`}>
                {validationData.actionCount} action{validationData.actionCount !== 1 ? 's' : ''}
              </span>
            )}
          </>
        )}

        <div className="w-px h-3 bg-gray-300 mx-1" />

        {isTestMode && (
          <>
            <button onClick={() => window.location.reload()} className={BTN_GRAY}>
              Reload
            </button>

            <button onClick={handleReset} disabled={isResetting} className={`${BTN_GRAY} ${BTN_DISABLED}`}>
              {isResetting ? 'Resetting...' : 'Reset'}
            </button>

            <div className="w-px h-3 bg-gray-300 mx-1" />
          </>
        )}

        <button
          onClick={handleValidateClick}
          className={getValidateButtonClass(currentValidation?.status, showValidationSidebar)}
          title={showValidationSidebar ? 'Close validation panel' : 'Open validation panel'}
        >
          VALIDATE
        </button>

        <button
          onClick={handleHighlighterClick}
          disabled={!highlighterAvailable}
          className={getHighlighterButtonClass(showSidebar, highlighterAvailable)}
          title={!highlighterAvailable ? highlighterError : `${showSidebar ? 'Close' : 'Open'} highlighter panel`}
        >
          Highlighter
        </button>
      </div>

      {(hasOutputs || isGenerating) && (
        <HighlighterSidebar
          scenarioId={scenarioId}
          isOpen={showSidebar}
          metadata={metadata}
          isGenerating={isGenerating}
          onClose={() => setShowSidebar(false)}
          onRegenerate={() => handleGenerateOrUseCache(true)}
        />
      )}

      {hasValidation && (
        <ValidationSidebar
          scenarioId={scenarioId}
          scenario={scenario!}
          result={currentValidation!}
          isOpen={isTestMode ? showValidationSidebar : true}
          onClose={() => isTestMode && setShowValidationSidebar(false)}
        />
      )}
    </>
  );
}
