'use client';

// Validation Sidebar Component
// Displays validation results (pass/fail, actions, expected action)

import type { ValidationResult, Scenario } from '@/types/scenario';

interface ValidationSidebarProps {
  scenarioId: string;
  scenario: Scenario;
  result: ValidationResult;
  isOpen: boolean;
  onClose: () => void;
}

export default function ValidationSidebar({
  scenario,
  result,
  isOpen,
  onClose
}: ValidationSidebarProps) {
  const { pass, actions, actionCount } = result;

  return (
    <div
      className={`
        fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-[60]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      {/* Header */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div
            data-test-result={pass ? 'pass' : 'fail'}
            className={`font-mono text-sm font-bold uppercase ${
              pass ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {pass ? 'SUCCESS' : 'FAIL'}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-60px)]">
        {/* Result Summary */}
        <div className="text-gray-600 text-sm font-mono">
          {pass
            ? 'Exactly 1 correct action recorded'
            : actionCount === 0
            ? 'No actions recorded'
            : actionCount > 1
            ? `Multiple actions recorded (${actionCount}, expected 1)`
            : 'Wrong action or element'
          }
        </div>

        {/* Recorded Actions Section */}
        <div>
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
        <div>
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
        <div>
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
        <div>
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
    </div>
  );
}
