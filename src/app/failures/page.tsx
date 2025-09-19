'use client';

import { useState } from 'react';

interface RequestResult {
  url: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  error?: string;
}

export default function FailuresPage() {
  const [results, setResults] = useState<RequestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runFailureTests = async () => {
    setIsRunning(true);
    setResults([]);

    const testRequests = [
      { url: '/api/404', name: '404 Not Found' },
      { url: '/api/500', name: '500 Server Error' },
      { url: '/api/abort', name: 'Request Abort' },
    ];

    // Initialize results
    const initialResults = testRequests.map(req => ({
      url: req.name,
      status: 'pending' as const,
      message: 'Request pending...'
    }));
    setResults(initialResults);

    // Run requests in parallel
    const promises = testRequests.map(async (req, index) => {
      try {
        const controller = new AbortController();
        
        // For the abort test, abort after 100ms
        if (req.url === '/api/abort') {
          setTimeout(() => controller.abort(), 100);
        }

        const response = await fetch(req.url, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        setResults(prev => prev.map((result, i) => 
          i === index 
            ? { ...result, status: 'success', message: data.message || 'Success' }
            : result
        ));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        setResults(prev => prev.map((result, i) => 
          i === index 
            ? { 
                ...result, 
                status: 'error', 
                message: 'Request failed',
                error: errorMessage
              }
            : result
        ));
      }
    });

    await Promise.allSettled(promises);
    setIsRunning(false);
  };

  const getStatusColor = (status: RequestResult['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
    }
  };

  const getStatusIcon = (status: RequestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  return (
    <div className="min-h-screen p-8 bg-orange-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-orange-900 mb-8">
          Failed Requests Test
        </h1>
        <p className="text-lg text-orange-700 mb-8">
          This page tests how the waiter handles various types of request failures.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Test Controls</h2>
          <button
            onClick={runFailureTests}
            disabled={isRunning}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isRunning ? 'Running Tests...' : 'Run Failure Tests'}
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
          {results.length === 0 ? (
            <p className="text-gray-500">Click "Run Failure Tests" to start testing.</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{result.url}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)} {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700">{result.message}</p>
                  {result.error && (
                    <p className="text-red-600 text-sm mt-2 font-mono bg-red-50 p-2 rounded">
                      Error: {result.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should not hang on failed requests. It should detect that 
            all requests have completed (successfully or with errors) and resolve appropriately.
          </p>
        </div>
      </div>
    </div>
  );
}
