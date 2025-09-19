'use client';

import { useState, useEffect } from 'react';

export default function IframesPage() {
  const [sameOriginLoaded, setSameOriginLoaded] = useState(false);
  const [crossOriginLoaded, setCrossOriginLoaded] = useState(false);
  const [status, setStatus] = useState('Loading iframes...');

  useEffect(() => {
    // Simulate same-origin iframe completing its fetch
    const sameOriginTimer = setTimeout(() => {
      setSameOriginLoaded(true);
      setStatus('Same-origin iframe completed its fetch');
    }, 2000);

    // Simulate cross-origin iframe loading
    const crossOriginTimer = setTimeout(() => {
      setCrossOriginLoaded(true);
      setStatus('Both iframes loaded - page should be stable');
    }, 3000);

    return () => {
      clearTimeout(sameOriginTimer);
      clearTimeout(crossOriginTimer);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-cyan-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8">
          Iframes Test
        </h1>
        <p className="text-lg text-cyan-700 mb-8">
          This page tests iframe handling with same-origin and cross-origin iframes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Current Status:</p>
                <p className="text-lg font-semibold text-gray-800">{status}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Same-Origin Iframe:</p>
                <p className="text-lg font-semibold text-blue-800">
                  {sameOriginLoaded ? '✅ Done' : '⏳ Loading...'}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-sm text-green-600">Cross-Origin Iframe:</p>
                <p className="text-lg font-semibold text-green-800">
                  {crossOriginLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Iframe Types</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h3 className="font-semibold text-blue-800">Same-Origin Iframe</h3>
                <p className="text-sm text-blue-600">
                  Makes a fetch request after 1 second, should be detectable by waiter
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <h3 className="font-semibold text-green-800">Cross-Origin Iframe</h3>
                <p className="text-sm text-green-600">
                  Loads external content, may not be detectable by waiter
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Same-origin iframe */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Same-Origin Iframe</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                src="/api/iframe-content"
                width="100%"
                height="300"
                className="border-0"
                title="Same-origin iframe"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This iframe loads content from the same origin and makes a fetch request.
            </p>
          </div>

          {/* Cross-origin iframe */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Cross-Origin Iframe</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                src="https://example.com"
                width="100%"
                height="300"
                className="border-0"
                title="Cross-origin iframe"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This iframe loads content from a different origin (example.com).
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect the same-origin iframe&apos;s fetch request and wait for it to complete. 
            Cross-origin iframe activity may not be detectable due to security restrictions.
          </p>
        </div>
      </div>
    </div>
  );
}
