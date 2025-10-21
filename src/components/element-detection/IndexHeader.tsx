'use client';

import { useState } from 'react';

export default function IndexHeader() {
  const [isResetting, setIsResetting] = useState(false);

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
    </header>
  );
}
