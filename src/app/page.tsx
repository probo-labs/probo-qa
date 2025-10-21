import Link from "next/link";
import { getAllScenarioIds } from '@/lib/scenarios';

export default function Home() {
  // Get actual test count from element-detection
  const elementDetectionTestCount = getAllScenarioIds().length;

  const testCategories = [
    {
      path: "/is-page-stable",
      title: "Is Page Stable?",
      description: "Test scenarios for page stability detection and waiter behavior",
      icon: "🎯",
      color: "bg-blue-100 hover:bg-blue-200",
      testCount: 12 // Hardcoded for now
    },
    {
      path: "/element-detection",
      title: "Element Detection",
      description: "Test scenarios for annotation failure modes in AI-powered web automation",
      icon: "🔍",
      color: "bg-green-100 hover:bg-green-200",
      testCount: elementDetectionTestCount
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            🧪 Probo QA Kitchen Sink
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive test scenarios for Probo automation testing
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
            <p className="text-gray-700">
              This is a collection of test scenarios designed to validate different aspects 
              of Probo&apos;s automation capabilities. Each category focuses on specific 
              testing challenges and edge cases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testCategories.map((category) => (
            <Link
              key={category.path}
              href={category.path}
              className={`${category.color} rounded-xl p-8 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {category.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>

                <div className="text-sm font-semibold text-gray-700">
                  {category.testCount} {category.testCount === 1 ? 'Test' : 'Tests'}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎯 Test Categories Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Page Stability</h3>
              <p className="text-sm text-gray-600">Navigation, network, UI changes, performance</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Element Detection</h3>
              <p className="text-sm text-gray-600">Annotation failure modes, label positions, widget interactions</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-600 text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">UI Testing</h3>
              <p className="text-sm text-gray-600">Coming soon - visual and interaction testing</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-600 text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Coming soon - performance and load testing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}