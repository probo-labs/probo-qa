import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const testScenarios = [
    {
      path: "/classic",
      title: "Classic Load",
      description: "Baseline test with static content, CSS, and images",
      color: "bg-gray-100 hover:bg-gray-200"
    },
    {
      path: "/redirect3",
      title: "Redirect Chain",
      description: "Tests waiter across multiple document navigations",
      color: "bg-blue-100 hover:bg-blue-200"
    },
    {
      path: "/hash",
      title: "Hash-Only Navigation",
      description: "Tests same-document navigation (SPA-style hash changes)",
      color: "bg-purple-100 hover:bg-purple-200"
    },
    {
      path: "/spa",
      title: "SPA PushState",
      description: "Tests SPA soft navigation with delayed XHR",
      color: "bg-indigo-100 hover:bg-indigo-200"
    },
    {
      path: "/xhr-bursts",
      title: "XHR Bursts",
      description: "Tests repeated inflight requests and DOM churn",
      color: "bg-red-100 hover:bg-red-200"
    },
    {
      path: "/failures",
      title: "Failed Requests",
      description: "Tests waiter behavior with various request failures",
      color: "bg-orange-100 hover:bg-orange-200"
    },
    {
      path: "/sse",
      title: "Server-Sent Events",
      description: "Tests infinite SSE connections",
      color: "bg-teal-100 hover:bg-teal-200"
    },
    {
      path: "/ws",
      title: "WebSocket Noise",
      description: "Tests infinite WebSocket connections",
      color: "bg-cyan-100 hover:bg-cyan-200"
    },
    {
      path: "/dom-churn",
      title: "DOM Churn",
      description: "Tests DOM stability without network requests",
      color: "bg-pink-100 hover:bg-pink-200"
    },
    {
      path: "/cls",
      title: "Layout Shifts (CLS)",
      description: "Tests layout shift detection",
      color: "bg-yellow-100 hover:bg-yellow-200"
    },
    {
      path: "/iframes",
      title: "Iframes",
      description: "Tests same-origin vs cross-origin iframe handling",
      color: "bg-emerald-100 hover:bg-emerald-200"
    },
    {
      path: "/perf-mix",
      title: "Performance Mix",
      description: "Tests prefetch, cache hits, and large assets",
      color: "bg-green-100 hover:bg-green-200"
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🚀 Probo QA Chaos Tests
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Stress-test your waiter with different navigation, network, and UI behaviors
          </p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-700">
              Each test scenario is designed to challenge different aspects of your waiter's 
              ability to detect when a page is truly stable and ready for interaction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testScenarios.map((scenario, index) => (
            <Link
              key={scenario.path}
              href={scenario.path}
              className={`${scenario.color} rounded-lg p-6 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg`}
            >
              <div className="flex items-start space-x-3">
                <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {scenario.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎯 Test Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">🌐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Navigation</h3>
              <p className="text-sm text-gray-600">Redirects, hash changes, SPA routing</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">📡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Network</h3>
              <p className="text-sm text-gray-600">XHR bursts, failures, SSE, WebSocket</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">🎨</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">UI Changes</h3>
              <p className="text-sm text-gray-600">DOM churn, layout shifts, animations</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Performance</h3>
              <p className="text-sm text-gray-600">Prefetch, cache, large assets, iframes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
