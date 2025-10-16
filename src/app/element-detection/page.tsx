// Element Detection Test Suite - Index Page
// Minimal directory listing - Django style

import { getAllScenarioIds, groupByDimension, getScenario } from '@/lib/scenarios';
import { getSessionId } from '@/lib/session';
import { prisma } from '@/lib/db';
import { validateScenario } from '@/lib/validation';
import type { ActionType, ScenarioInteraction } from '@/types/scenario';
import Link from 'next/link';
import IndexHeader from '@/components/element-detection/IndexHeader';

// Labels that represent default/expected behavior and should be hidden
const DEFAULT_LABELS = [
  'action_complexity=single-action',
];

export default async function ElementDetectionIndex() {
  const allIds = getAllScenarioIds();
  const totalTests = allIds.length;

  // Get session ID
  const sessionId = await getSessionId();

  // PERFORMANCE FIX: Fetch ALL interactions for this session in a single query
  // instead of one query per test (N+1 problem)
  const allDbActions = await prisma.scenarioInteractionState.findMany({
    where: { sessionId },
    orderBy: { timestamp: 'asc' },
  });

  // Group actions by scenarioId in memory
  const actionsByTestId = allDbActions.reduce((acc, action) => {
    if (!acc[action.scenarioId]) {
      acc[action.scenarioId] = [];
    }
    acc[action.scenarioId].push(action);
    return acc;
  }, {} as Record<string, typeof allDbActions>);

  // Get validation status for all tests
  const validationStatuses: Record<string, 'pass' | 'fail' | null> = {};

  for (const scenarioId of allIds) {
    const test = getScenario(scenarioId);
    if (!test) continue;

    const dbActions = actionsByTestId[scenarioId] || [];

    if (dbActions.length === 0) {
      validationStatuses[scenarioId] = null; // No validation yet
      continue;
    }

    // Convert to ScenarioInteraction type
    const actions: ScenarioInteraction[] = dbActions.map(action => ({
      id: action.id,
      scenarioId: action.scenarioId,
      sessionId: action.sessionId,
      actionPerformed: action.actionPerformed as ActionType,
      elementInteracted: action.elementInteracted,
      valueFilled: action.valueFilled,
      isCorrect: action.isCorrect,
      timestamp: action.timestamp,
      metadata: action.metadata as Record<string, unknown> | undefined,
    }));

    // Validate
    const result = validateScenario(test, actions);
    validationStatuses[scenarioId] = result.pass ? 'pass' : 'fail';
  }

  // Group tests by element density
  const groupedByDensity = groupByDimension('element_density');

  // Density order for display
  const densityOrder = ['sparse', 'moderate', 'dense', 'extreme-dense'];

  return (
    <div className="min-h-screen bg-[#fafafa] p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header with Reset All button */}
        <IndexHeader totalTests={totalTests} />

        {/* Tests grouped by density */}
        {densityOrder.map((density) => {
          const tests = groupedByDensity[density];
          if (!tests || tests.length === 0) return null;

          return (
            <div key={density} className="mb-6">
              <div className="text-[0.7rem] font-medium uppercase tracking-[2px] text-gray-400 mb-2">
                {density.replace('-', ' ')}
              </div>

              <ul className="list-none">
                {tests.map((test) => {
                  const globalIndex = allIds.indexOf(test.id) + 1;
                  const status = validationStatuses[test.id];

                  // Determine Val button styling based on status
                  let valButtonClass = "px-3 py-1 text-[0.65rem] border transition-all rounded-xl h-[22px] inline-flex items-center";
                  if (status === 'pass') {
                    valButtonClass += " text-green-700 border-green-300 bg-green-50 hover:text-green-900 hover:border-green-500";
                  } else if (status === 'fail') {
                    valButtonClass += " text-red-700 border-red-300 bg-red-50 hover:text-red-900 hover:border-red-500";
                  } else {
                    valButtonClass += " text-gray-600 border-gray-200 bg-white hover:text-gray-900 hover:border-gray-900";
                  }

                  return (
                    <li key={test.id} className="py-1 grid grid-cols-[auto_1fr] items-center gap-2.5 hover:pl-0.5 transition-all">
                      {/* Actions */}
                      <div className="flex gap-1.5">
                        <Link
                          href={`/element-detection/${test.id}`}
                          className="px-3 py-1 text-[0.65rem] text-gray-600 border border-gray-200 bg-white hover:text-gray-900 hover:border-gray-900 transition-all rounded-xl h-[22px] inline-flex items-center"
                        >
                          Test
                        </Link>
                        <Link
                          href={`/element-detection/${test.id}/validation`}
                          className={valButtonClass}
                        >
                          Val
                        </Link>
                      </div>

                      {/* Test Info */}
                      <div className="pl-5 flex items-center gap-2 flex-wrap">
                        <Link
                          href={`/element-detection/${test.id}`}
                          className="text-gray-900 no-underline text-[0.7rem] leading-snug hover:text-gray-600 hover:underline transition-colors"
                        >
                          <span className="text-gray-500 font-light mr-1.5">
                            {globalIndex}.
                          </span>
                          <span className="text-gray-500 font-light mr-2.5 font-mono text-[0.65rem]">
                            {test.id}
                          </span>
                          {test.title}
                          <span className="text-gray-500 font-light"> {test.expectedAction}</span>
                        </Link>
                        {/* Labels - filter out defaults, only show exceptions */}
                        {test.labels
                          .filter((label) => !DEFAULT_LABELS.includes(label))
                          .map((label) => (
                            <span
                              key={label}
                              className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[0.6rem] rounded-full border border-blue-200"
                            >
                              {label}
                            </span>
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-300 text-[0.65rem] font-light tracking-widest">
          {totalTests} Tests
        </footer>
      </div>
    </div>
  );
}
