// Element Detection Test Suite - Index Page
// Minimal directory listing - Django style

import { getAllScenarioIds, groupByDimension } from '@/lib/scenarios';
import Link from 'next/link';
import IndexHeader from '@/components/element-detection/IndexHeader';

const DEFAULT_LABELS = [
  'action_complexity=single-action',
];

export default async function ElementDetectionIndex() {
  const allIds = getAllScenarioIds();
  const totalTests = allIds.length;

  // Group tests by element density
  const groupedByDensity = groupByDimension('element_density');

  // Density order for display
  const densityOrder = ['sparse', 'moderate', 'dense', 'extreme-dense'];

  return (
    <div className="min-h-screen bg-[#fafafa] p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header with Reset All button */}
        <IndexHeader />

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

                  return (
                    <li key={test.id} className="py-1 hover:pl-0.5 transition-all">
                      <div className="flex items-center gap-2 flex-wrap">
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
