'use client';

// Validation Result Component
// Displays pass/fail status and recorded actions
// Styled to match Django validation page with monospace aesthetic

import type { ValidationResult as ValidationResultType, Scenario } from '@/types/scenario';

interface ValidationResultProps {
  scenarioId: string;
  scenario: Scenario;
  result: ValidationResultType;
  prevTestId?: string | null;
  nextTestId?: string | null;
  position?: string;
}

export default function ValidationResult({ scenario, result }: ValidationResultProps) {
  const { pass, actions, actionCount } = result;

  return (
    <div className="max-w-4xl mx-auto p-5">
      {/* Result Header - Compact */}
      <div
        data-test-result={pass ? 'pass' : 'fail'}
        className={`mb-5 p-3 border-l-4 bg-gray-50 font-mono text-sm ${
        pass ? 'border-green-600' : 'border-red-600'
      }`}>
        <span className={`font-bold uppercase ${pass ? 'text-green-600' : 'text-red-600'}`}>
          {pass ? 'SUCCESS' : 'FAIL'}
        </span>
        <span className="text-gray-600"> — </span>
        <span className="text-gray-600">
          {pass
            ? 'Exactly 1 correct action recorded'
            : actionCount === 0
            ? 'No actions recorded'
            : actionCount > 1
            ? `Multiple actions recorded (${actionCount}, expected 1)`
            : 'Wrong action or element'
          }
        </span>
      </div>

      {/* Recorded Actions Section */}
      <div className="mb-5">
        <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-mono mb-1.5">
          Recorded Actions ({actionCount})
        </div>
        <div className="bg-gray-50 border border-gray-200 p-3 font-mono text-xs leading-relaxed">
          {actionCount === 0 ? (
            <div className="text-gray-400 italic">(no actions recorded)</div>
          ) : (
            actions.map((action, index) => {
              const timestamp = new Date(action.timestamp);
              const timeStr = timestamp.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3
              });

              return (
                <div key={action.id} className="text-gray-900">
                  <span className="text-gray-500 inline-block min-w-[130px]">
                    {index + 1}. {timeStr}
                  </span>
                  <span className="font-semibold">{action.actionPerformed}</span>
                  {' '}
                  {action.elementInteracted}
                  {action.valueFilled && (
                    <span className="text-gray-500"> = &quot;{action.valueFilled}&quot;</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Expected Action Section */}
      <div className="mb-5">
        <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-mono mb-1.5">
          Expected Action
        </div>
        <div className="bg-gray-50 border border-gray-200 p-3 font-mono text-xs space-y-0.5">
          <div className="text-gray-900">
            <span className="text-gray-500 inline-block min-w-[100px]">Action:</span>
            <span className="font-semibold">{scenario.expectedAction}</span>
          </div>
          <div className="text-gray-900">
            <span className="text-gray-500 inline-block min-w-[100px]">Element:</span>
            <span className="font-semibold">{scenario.expectedTarget}</span>
          </div>
        </div>
      </div>

      {/* Validation Logic Explanation */}
      <div className="mb-5">
        <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-mono mb-1.5">
          Validation Logic
        </div>
        <div className="bg-gray-50 border border-gray-200 p-3 font-mono text-xs text-gray-700 space-y-1">
          <div>✓ Check: actions.length === 1</div>
          <div>✓ Check: actions[0].actionPerformed === &quot;{scenario.expectedAction}&quot;</div>
          <div>✓ Check: actions[0].elementInteracted === &quot;{scenario.expectedTarget}&quot;</div>
          <div className="pt-1.5 border-t border-gray-300 mt-2">
            Result: <span className={pass ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
              {pass ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </div>
      </div>

      {/* Test Description Section */}
      <div className="mb-12">
        <div className="text-[0.65rem] uppercase tracking-wider text-gray-400 font-mono mb-1.5">
          Test Description
        </div>
        <div className="bg-gray-50 border border-gray-200 p-3 font-mono text-xs space-y-1">
          <div className="text-gray-900">
            <span className="text-gray-500 inline-block min-w-[100px]">ID:</span>
            <span className="font-semibold">{scenario.id}</span>
          </div>
          <div className="text-gray-900">
            <span className="text-gray-500 inline-block min-w-[100px]">Title:</span>
            <span className="font-semibold">{scenario.title}</span>
          </div>
          <div className="text-gray-900">
            <span className="text-gray-500 inline-block min-w-[100px]">Description:</span>
            <span>{scenario.description}</span>
          </div>
          <div className="text-gray-900">
            <span className="text-gray-500 inline-block min-w-[100px] align-top">Labels:</span>
            <div className="inline-flex gap-1.5 flex-wrap">
              {scenario.labels.map((label) => (
                <span
                  key={label}
                  className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[0.6rem] rounded-full border border-blue-200"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
