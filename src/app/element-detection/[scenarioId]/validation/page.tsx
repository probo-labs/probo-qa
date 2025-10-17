// Validation Results Page
// Shows pass/fail status in sidebar

import { getSessionId } from '@/lib/session';
import { getScenario, getNavigationContext } from '@/lib/scenarios';
import { validateAndUpdateScenario } from '@/lib/scenario-validation';
import ScenarioNavigation from '@/components/element-detection/ScenarioNavigation';
import { notFound } from 'next/navigation';

export default async function ValidationPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = await params;
  const test = getScenario(scenarioId);

  if (!test) {
    notFound();
  }

  // Get navigation context
  const navContext = getNavigationContext(scenarioId);

  // Get session ID
  const sessionId = await getSessionId();

  // Use shared validation service
  const result = await validateAndUpdateScenario(scenarioId, sessionId);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navigation - Bottom Left */}
      <div className="fixed bottom-2.5 left-2.5 z-[1000]">
        <ScenarioNavigation
          scenarioId={scenarioId}
          prevTestId={navContext.prevTestId}
          nextTestId={navContext.nextTestId}
          position={navContext.position}
          mode="validation"
          validationPageNav={true}
          scenario={test}
          validationResult={result}
        />
      </div>
    </div>
  );
}
