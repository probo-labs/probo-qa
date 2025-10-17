// Element Detection Scenario Page
// Clean test page with no hints - records user interactions

import { getScenario, getNavigationContext } from '@/lib/scenarios';
import { notFound } from 'next/navigation';
import ScenarioPageClient from './ScenarioPageClient';
import ScenarioNavigationWrapper from './ScenarioNavigationWrapper';

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
      {/* Scenario Content - Clean page with no navigation */}
      <ScenarioPageClient scenarioId={scenarioId} instructionHint={instructionText} />

      {/* Test Controls - Only rendered in DOM on hover */}
      <ScenarioNavigationWrapper
        scenarioId={scenarioId}
        prevTestId={navContext.prevScenarioId}
        nextTestId={navContext.nextScenarioId}
        position={navContext.position}
        instructionHint={instructionText}
      />
    </>
  );
}
