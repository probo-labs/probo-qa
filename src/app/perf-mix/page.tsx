'use client';

import { useState, useEffect } from 'react';

export default function PerfMixPage() {
  const [prefetchLoaded, setPrefetchLoaded] = useState(false);
  const [cacheHit, setCacheHit] = useState(false);
  const [largeImageLoaded, setLargeImageLoaded] = useState(false);
  const [status, setStatus] = useState('Loading performance mix test...');

  useEffect(() => {
    // Simulate prefetch completion
    const prefetchTimer = setTimeout(() => {
      setPrefetchLoaded(true);
      setStatus('Prefetch asset loaded');
    }, 500);

    // Simulate cache hit
    const cacheTimer = setTimeout(() => {
      setCacheHit(true);
      setStatus('Cache hit detected');
    }, 1000);

    // Simulate large image loading
    const imageTimer = setTimeout(() => {
      setLargeImageLoaded(true);
      setStatus('All performance tests complete');
    }, 3000);

    return () => {
      clearTimeout(prefetchTimer);
      clearTimeout(cacheTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-emerald-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-900 mb-8">
          Performance Mix Test
        </h1>
        <p className="text-lg text-emerald-700 mb-8">
          This page tests prefetch, cache hits, and large asset handling.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Current Status:</p>
                <p className="text-lg font-semibold text-gray-800">{status}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Prefetch:</p>
                <p className="text-lg font-semibold text-blue-800">
                  {prefetchLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-sm text-green-600">Cache Hit:</p>
                <p className="text-lg font-semibold text-green-800">
                  {cacheHit ? '✅ Hit' : '⏳ Loading...'}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded">
                <p className="text-sm text-purple-600">Large Image:</p>
                <p className="text-lg font-semibold text-purple-800">
                  {largeImageLoaded ? '✅ Loaded' : '⏳ Loading...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Performance Tests</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <h3 className="font-semibold text-blue-800">Prefetch Asset</h3>
                <p className="text-sm text-blue-600">
                  Links a prefetch asset that loads in the background
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <h3 className="font-semibold text-green-800">Cache Headers</h3>
                <p className="text-sm text-green-600">
                  Fetches JSON API with cache headers
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                <h3 className="font-semibold text-purple-800">Large Image</h3>
                <p className="text-sm text-purple-600">
                  Loads a large image (5-6 MB) to test asset handling
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Performance Elements</h2>
          
          {/* Prefetch link */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Prefetch Asset:</h3>
            <link rel="prefetch" href="/api/prefetch-asset" />
            <p className="text-sm text-gray-600">
              This asset is prefetched in the background and should not block the waiter.
            </p>
          </div>

          {/* Cache test */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cache Test:</h3>
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/cache-test', {
                    headers: {
                      'Cache-Control': 'max-age=3600'
                    }
                  });
                  const data = await response.json();
                  alert(`Cache test result: ${data.message}`);
                } catch (error) {
                  alert('Cache test failed');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Test Cache Headers
            </button>
          </div>

          {/* Large image */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Large Image (5-6 MB):</h3>
            {largeImageLoaded ? (
              <img 
                src="https://picsum.photos/1920/1080" 
                alt="Large test image"
                className="rounded-lg shadow-md max-w-full h-auto"
              />
            ) : (
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
                  <p className="text-gray-500">Loading large image...</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should handle prefetch requests, cache hits, and large asset loading appropriately. 
            Prefetch should not block the waiter, while cache hits and large assets should be considered.
          </p>
        </div>
      </div>
    </div>
  );
}
