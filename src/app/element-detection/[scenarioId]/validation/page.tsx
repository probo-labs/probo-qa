// Validation Results Page
// Shows pass/fail status for test

import { getSessionId } from '@/lib/session';
import { getScenario, getNavigationContext } from '@/lib/scenarios';
import { validateAndUpdateScenario } from '@/lib/scenario-validation';
import ValidationResult from '@/components/element-detection/ValidationResult';
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
    <div className="min-h-screen bg-[#fafafa] py-5">
      <ValidationResult
        scenarioId={scenarioId}
        scenario={test}
        result={result}
        prevTestId={navContext.prevTestId}
        nextTestId={navContext.nextTestId}
        position={navContext.position}
      />

      {/* Navigation - Bottom Right */}
      <div className="fixed bottom-2.5 right-2.5 z-[1000]">
        <ScenarioNavigation
          scenarioId={scenarioId}
          prevTestId={navContext.prevTestId}
          nextTestId={navContext.nextTestId}
          position={navContext.position}
          mode="validation"
          validationPageNav={true}
        />
      </div>
    </div>
  );
}
