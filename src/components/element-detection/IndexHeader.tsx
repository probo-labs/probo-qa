'use client';

import { useState } from 'react';
import { getAllScenarioIds } from '@/lib/scenarios';

export default function IndexHeader() {
  const [isResetting, setIsResetting] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [fillProgress, setFillProgress] = useState({ current: 0, total: 0 });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResetAll = async () => {
    setIsResetting(true);

    try {
      const response = await fetch('/api/tests/reset-all', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset all tests');
      }

      // Hard reload to show blank state
      window.location.reload();
    } catch (err) {
      console.error('Failed to reset all tests:', err);
      setIsResetting(false);
    }
  };

  const handleFillCache = async () => {
    setIsFilling(true);
    const scenarioIds = getAllScenarioIds();
    setFillProgress({ current: 0, total: scenarioIds.length });

    try {
      for (let i = 0; i < scenarioIds.length; i++) {
        const scenarioId = scenarioIds[i];
        setFillProgress({ current: i + 1, total: scenarioIds.length });

        const response = await fetch(`/api/scenarios/${scenarioId}/generate-outputs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageUrl: `${window.location.origin}/element-detection/${scenarioId}`,
            forceRegenerate: false
          }),
        });

        if (!response.ok) {
          console.error(`Failed to generate cache for ${scenarioId}`);
        }
      }

      // Show success briefly
      setTimeout(() => {
        setIsFilling(false);
        setFillProgress({ current: 0, total: 0 });
      }, 2000);
    } catch (err) {
      console.error('Failed to fill cache:', err);
      setIsFilling(false);
      setFillProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteCache = async () => {
    if (!confirm('Are you sure you want to delete all highlighter cache? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/api/scenarios/cache', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete cache');
      }

      // Show success briefly
      setTimeout(() => {
        setIsDeleting(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to delete cache:', err);
      alert('Failed to delete cache. Check console for details.');
      setIsDeleting(false);
    }
  };

  const fillButtonText = () => {
    if (isFilling) {
      if (fillProgress.current === fillProgress.total) {
        return 'Cache filled! ✓';
      }
      return `Filling... ${fillProgress.current}/${fillProgress.total}`;
    }
    return 'Fill Highlighter Cache';
  };

  return (
    <header className="mb-6 flex items-center gap-3">
      <h1 className="text-2xl font-light tracking-tight text-gray-900">
        Tests
      </h1>
      <button
        onClick={handleResetAll}
        disabled={isResetting}
        className="px-3 py-1.5 text-[0.7rem] text-gray-700 border border-gray-300 bg-gray-50 hover:text-gray-900 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg"
      >
        {isResetting ? 'Resetting...' : 'Reset All'}
      </button>
      <button
        onClick={handleFillCache}
        disabled={isFilling}
        className="px-3 py-1.5 text-[0.7rem] text-blue-700 border border-blue-300 bg-blue-50 hover:text-blue-900 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg"
      >
        {fillButtonText()}
      </button>
      <button
        onClick={handleDeleteCache}
        disabled={isDeleting}
        className="px-3 py-1.5 text-[0.7rem] text-red-700 border border-red-300 bg-red-50 hover:text-red-900 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg"
      >
        {isDeleting ? 'Deleted! ✓' : 'Delete Cache'}
      </button>
    </header>
  );
}
