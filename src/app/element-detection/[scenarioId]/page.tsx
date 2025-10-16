// Element Detection Scenario Page
// Clean test page with no hints - records user interactions

import { getScenario, getNavigationContext } from '@/lib/scenarios';
import ScenarioNavigation from '@/components/element-detection/ScenarioNavigation';
import { notFound } from 'next/navigation';
import ScenarioPageClient from './ScenarioPageClient';

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const scenario = getScenario(scenarioId);

  if (!scenario) {
    notFound();
  }

  // Get prev/next navigation
  const navContext = getNavigationContext(scenarioId);

  // Generate instruction hint text
  const instructionText = (() => {
    const target = scenario.expectedTarget.replace(/-/g, ' ');
    switch (scenario.expectedAction) {
      case 'FILL':
        return `Fill the ${target}`;
      case 'CLICK':
        return `Click the ${target}`;
      case 'SELECT':
        return `Select an option from ${target}`;
      default:
        return `Interact with ${target}`;
    }
  })();

  return (
    <>
      {/* Scenario Content */}
      <ScenarioPageClient scenarioId={scenarioId} instructionHint={instructionText} />

      {/* Test Controls - Bottom Right */}
      <div className="fixed bottom-2.5 right-2.5 z-[1000]">
        <ScenarioNavigation
          scenarioId={scenarioId}
          prevScenarioId={navContext.prevScenarioId}
          nextScenarioId={navContext.nextScenarioId}
          position={navContext.position}
          mode="test"
          instructionHint={instructionText}
        />
      </div>
    </>
  );
}
