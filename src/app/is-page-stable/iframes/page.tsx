'use client';

import { useState, useEffect } from 'react';

export default function IframesPage() {
  const [sameOriginLoaded, setSameOriginLoaded] = useState(false);
  const [crossOriginLoaded, setCrossOriginLoaded] = useState(false);
  const [status, setStatus] = useState('Ready to start iframe test');
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  const startIframeTest = () => {
    if (isTestRunning) return;
    
    setIsTestRunning(true);
    setTestComplete(false);
    setSameOriginLoaded(false);
    setCrossOriginLoaded(false);
    setStatus('Starting iframe test...');

    // Simulate same-origin iframe completing its fetch
    const sameOriginTimer = setTimeout(() => {
      setSameOriginLoaded(true);
      setStatus('Same-origin iframe completed its fetch');
    }, 2000);

    // Simulate cross-origin iframe loading
    const crossOriginTimer = setTimeout(() => {
      setCrossOriginLoaded(true);
      setStatus('Both iframes loaded - page should be stable');
      setIsTestRunning(false);
      setTestComplete(true);
    }, 3000);

    // Store timers for cleanup
    (window as Window & { iframeTimers?: { sameOriginTimer: NodeJS.Timeout; crossOriginTimer: NodeJS.Timeout } }).iframeTimers = { sameOriginTimer, crossOriginTimer };
  };

  useEffect(() => {
    return () => {
      // Cleanup timers if they exist
      const timers = (window as Window & { iframeTimers?: { sameOriginTimer: NodeJS.Timeout; crossOriginTimer: NodeJS.Timeout } }).iframeTimers;
      if (timers) {
        clearTimeout(timers.sameOriginTimer);
        clearTimeout(timers.crossOriginTimer);
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-4 bg-cyan-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-900 mb-4">
          Iframes Test
        </h1>
        <p className="text-base text-cyan-700 mb-4">
          This page tests iframe handling with same-origin and cross-origin iframes.
        </p>
        
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-semibold mb-3">Test Controls</h2>
          <button
            onClick={startIframeTest}
            disabled={isTestRunning}
            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isTestRunning ? 'Test Running...' : 'Start Iframe Test'}
          </button>
          <div className="mt-3 p-2 rounded-lg bg-gray-100">
            <p className="text-sm text-gray-600">Test Status:</p>
            <p className="text-base font-semibold text-gray-800" data-testid="iframe-test-status">
              {testComplete ? '✅ Test Complete' : isTestRunning ? '⏳ Running Test...' : '🔴 Ready to Start'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Status</h2>
            <div className="space-y-2">
              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-600">Current Status:</p>
                <p className="text-base font-semibold text-gray-800">{status}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded">
                <p className="text-sm text-blue-600">Same-Origin Iframe:</p>
                <p className="text-base font-semibold text-blue-800">
                  {sameOriginLoaded ? '✅ Done' : '⏳ Loading...'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded">
                <p className="text-sm text-green-600">Cross-Origin Iframe:</p>
                <p className="text-base font-semibold text-green-800">
                  {crossOriginLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Iframe Types</h2>
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <h3 className="font-semibold text-blue-800 text-sm">Same-Origin Iframe</h3>
                <p className="text-xs text-blue-600">
                  Makes a fetch request after 1 second, should be detectable by waiter
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <h3 className="font-semibold text-green-800 text-sm">Cross-Origin Iframe</h3>
                <p className="text-xs text-green-600">
                  Loads external content, may not be detectable by waiter
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Same-origin iframe */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Same-Origin Iframe</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                src="/api/iframe-content"
                width="100%"
                height="200"
                className="border-0"
                title="Same-origin iframe"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              This iframe loads content from the same origin and makes a fetch request.
            </p>
          </div>

          {/* Cross-origin iframe */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Cross-Origin Iframe</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                src="https://example.com"
                width="100%"
                height="200"
                className="border-0"
                title="Cross-origin iframe"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              This iframe loads content from a different origin (example.com).
            </p>
          </div>
        </div>
        
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <h3 className="text-base font-semibold text-yellow-800 mb-1">
            Expected Behavior
          </h3>
          <p className="text-sm text-yellow-700">
            The waiter should detect the same-origin iframe&apos;s fetch request and wait for it to complete. 
            Cross-origin iframe activity may not be detectable due to security restrictions.
          </p>
        </div>
      </div>
    </div>
  );
}
