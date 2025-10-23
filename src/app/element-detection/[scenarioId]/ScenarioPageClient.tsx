'use client';

import type { ComponentType } from 'react';
import type { ActionType } from '@/types/scenario';
import type { ScenarioProps } from '@/scenarios/shared/types';
import ScenarioA3c9 from '@/scenarios/a3c9/ScenarioA3c9';
import Scenario7f2e from '@/scenarios/7f2e/Scenario7f2e';
import ScenarioB5d1 from '@/scenarios/b5d1/ScenarioB5d1';
import ScenarioC8f3 from '@/scenarios/c8f3/ScenarioC8f3';
import ScenarioD4a1 from '@/scenarios/d4a1/ScenarioD4a1';
import ScenarioD5a2 from '@/scenarios/d5a2/ScenarioD5a2';
import ScenarioD6a3 from '@/scenarios/d6a3/ScenarioD6a3';
import ScenarioD7a4 from '@/scenarios/d7a4/ScenarioD7a4';
import ScenarioE8b2 from '@/scenarios/e8b2/ScenarioE8b2';
import ScenarioE9b3 from '@/scenarios/e9b3/ScenarioE9b3';
import ScenarioEab4 from '@/scenarios/eab4/ScenarioEab4';
import ScenarioEcb5 from '@/scenarios/ecb5/ScenarioEcb5';
import ScenarioF3c5 from '@/scenarios/f3c5/ScenarioF3c5';
import ScenarioF4c6 from '@/scenarios/f4c6/ScenarioF4c6';
import ScenarioF5c7 from '@/scenarios/f5c7/ScenarioF5c7';
import ScenarioF6c8 from '@/scenarios/f6c8/ScenarioF6c8';
import ScenarioA7d4 from '@/scenarios/a7d4/ScenarioA7d4';
import ScenarioA8d5 from '@/scenarios/a8d5/ScenarioA8d5';
import ScenarioA9d6 from '@/scenarios/a9d6/ScenarioA9d6';
import ScenarioAad7 from '@/scenarios/aad7/ScenarioAad7';
import ScenarioB9e6 from '@/scenarios/b9e6/ScenarioB9e6';
import ScenarioBae7 from '@/scenarios/bae7/ScenarioBae7';
import ScenarioBbe8 from '@/scenarios/bbe8/ScenarioBbe8';
import ScenarioBce9 from '@/scenarios/bce9/ScenarioBce9';
import ScenarioC2f8 from '@/scenarios/c2f8/ScenarioC2f8';
import ScenarioC3f9 from '@/scenarios/c3f9/ScenarioC3f9';
import ScenarioC4fa from '@/scenarios/c4fa/ScenarioC4fa';
import ScenarioC5fb from '@/scenarios/c5fb/ScenarioC5fb';

interface ScenarioPageClientProps {
  scenarioId: string;
  onAction: (action: ActionType, element: string) => void;
}

const scenarioComponents: Record<string, ComponentType<ScenarioProps>> = {
  'a3c9': ScenarioA3c9,
  '7f2e': Scenario7f2e,
  'b5d1': ScenarioB5d1,
  'c8f3': ScenarioC8f3,
  'd4a1': ScenarioD4a1,
  'd5a2': ScenarioD5a2,
  'd6a3': ScenarioD6a3,
  'd7a4': ScenarioD7a4,
  'e8b2': ScenarioE8b2,
  'e9b3': ScenarioE9b3,
  'eab4': ScenarioEab4,
  'ecb5': ScenarioEcb5,
  'f3c5': ScenarioF3c5,
  'f4c6': ScenarioF4c6,
  'f5c7': ScenarioF5c7,
  'f6c8': ScenarioF6c8,
  'a7d4': ScenarioA7d4,
  'a8d5': ScenarioA8d5,
  'a9d6': ScenarioA9d6,
  'aad7': ScenarioAad7,
  'b9e6': ScenarioB9e6,
  'bae7': ScenarioBae7,
  'bbe8': ScenarioBbe8,
  'bce9': ScenarioBce9,
  'c2f8': ScenarioC2f8,
  'c3f9': ScenarioC3f9,
  'c4fa': ScenarioC4fa,
  'c5fb': ScenarioC5fb,
};

export default function ScenarioPageClient({ scenarioId, onAction }: ScenarioPageClientProps) {
  const Component = scenarioComponents[scenarioId];

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 font-mono text-sm">
            Scenario <span className="font-bold">{scenarioId}</span> not implemented
          </p>
        </div>
      </div>
    );
  }

  return <Component onAction={onAction} />;
}
