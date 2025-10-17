// Test page for highlighter - simple scenario with known elements
// Only available in development/test mode

import TestPageLayout from '@/components/test-pages/TestPageLayout';

export default function SimpleHighlighterTestPage() {
  // Prevent access in production
  if (process.env.NODE_ENV === 'production' && !process.env.CI) {
    return <div>Not available in production</div>;
  }

  return (
    <TestPageLayout
      testId="test-highlighter-simple"
      title="Simple Highlighter Test"
    >
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Simple Highlighter Test Page</h1>

      {/* Known clickable elements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Clickable Elements (Expected: 3)</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Primary Button
        </button>
        <a href="#" className="text-blue-600 underline mr-2">
          Text Link
        </a>
        <button className="border border-gray-300 px-4 py-2 rounded">
          Secondary Button
        </button>
      </div>

      {/* Known fillable elements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Fillable Elements (Expected: 2)</h2>
        <input
          type="text"
          placeholder="Text input"
          className="border border-gray-300 px-3 py-2 rounded mr-2"
        />
        <textarea
          placeholder="Text area"
          className="border border-gray-300 px-3 py-2 rounded"
          rows={3}
        />
      </div>

      {/* Known selectable elements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Selectable Elements (Expected: 1)</h2>
        <select className="border border-gray-300 px-3 py-2 rounded">
          <option>Option 1</option>
          <option>Option 2</option>
          <option>Option 3</option>
        </select>
      </div>

      {/* Non-interactive elements */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Non-Interactive Elements</h2>
        <p className="mb-2">This is a paragraph of text.</p>
        <div className="bg-gray-100 p-4 rounded">
          <span>A div with some content</span>
        </div>
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3C/svg%3E" alt="Test image" className="mt-4" />
      </div>
      </div>
    </TestPageLayout>
  );
}
