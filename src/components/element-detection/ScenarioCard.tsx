// Test Card Component
// Card for displaying test in index page

import Link from 'next/link';
import type { TestCase } from '@/types/scenario';

interface ScenarioCardProps {
  test: TestCase;
  index?: number;
}

export default function ScenarioCard({ test, index }: ScenarioCardProps) {
  return (
    <Link
      href={`/element-detection/${test.id}`}
      className="block bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        {/* Test Number Badge */}
        {index !== undefined && (
          <div className="flex-shrink-0 bg-blue-100 text-blue-700 font-bold rounded-full w-10 h-10 flex items-center justify-center text-sm">
            {index}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Test ID + Title */}
          <div className="flex items-baseline gap-2 mb-2">
            <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {test.id}
            </code>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {test.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {test.description}
          </p>

          {/* Labels */}
          <div className="flex flex-wrap gap-1">
            {test.labels.map((label) => {
              const [dimension, value] = label.split('=');
              return (
                <span
                  key={label}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  title={label}
                >
                  {value}
                </span>
              );
            })}
          </div>

          {/* Expected Action */}
          <div className="mt-3 text-xs text-gray-500">
            Expected: <code className="font-mono">{test.expectedAction}</code> on{' '}
            <code className="font-mono">{test.expectedTarget}</code>
          </div>
        </div>
      </div>
    </Link>
  );
}
