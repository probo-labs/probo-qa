'use client';

// Test Controls Component
// Provides "VALIDATE TEST" button to trigger validation

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ScenarioControlsProps {
  scenarioId: string;
}

export default function ScenarioControls({ scenarioId }: ScenarioControlsProps) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);

    try {
      const response = await fetch(`/api/tests/${scenarioId}/validate`);

      if (!response.ok) {
        throw new Error('Failed to validate test');
      }

      router.push(`/element-detection/${scenarioId}/validation`);
    } catch (err) {
      console.error('Validation failed:', err);
      setIsValidating(false);
    }
  };

  return (
    <button
      onClick={handleValidate}
      disabled={isValidating}
      className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-2.5 py-1 border-none rounded shadow-md text-[10px] cursor-pointer transition-all"
    >
      {isValidating ? 'VALIDATING...' : 'VALIDATE'}
    </button>
  );
}
