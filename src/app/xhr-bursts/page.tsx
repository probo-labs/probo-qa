'use client';

import { useState, useEffect, useRef } from 'react';

export default function XHRBurstsPage() {
  const [requestCount, setRequestCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to start XHR bursts');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startBursts = () => {
    if (isActive) return;
    
    setIsActive(true);
    setRequestCount(0);
    setStatus('Starting XHR bursts every 400ms...');
    
    // Start firing XHR requests every 400ms
    intervalRef.current = setInterval(async () => {
      try {
        const response = await fetch('/api/burst');
        const data = await response.json();
        setRequestCount(prev => prev + 1);
        setStatus(`Request #${requestCount + 1} completed - ${data.message}`);
      } catch (error) {
        setStatus(`Request #${requestCount + 1} failed`);
        console.error('Request failed:', error);
      }
    }, 400);
    
    // Stop after ~3 seconds (7-8 requests)
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsActive(false);
      setStatus(`Bursts complete! Total requests: ${requestCount + 1}`);
    }, 3000);
  };

  const stopBursts = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setStatus(`Bursts stopped. Total requests: ${requestCount}`);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-red-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-red-900 mb-8">
          XHR Bursts Test
        </h1>
        <p className="text-lg text-red-700 mb-8">
          This page tests repeated inflight requests and DOM churn by firing XHR requests every 400ms.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Request Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Request Count:</p>
                <p className="text-3xl font-bold text-gray-800">{requestCount}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Status:</p>
                <p className="text-lg font-semibold text-blue-800">{status}</p>
              </div>
              <div className="bg-red-100 p-4 rounded">
                <p className="text-sm text-red-600">Active:</p>
                <p className="text-lg font-semibold text-red-800">
                  {isActive ? '🟢 Running' : '🔴 Stopped'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>
            <div className="space-y-4">
              <button
                onClick={startBursts}
                disabled={isActive}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isActive ? 'Bursts Running...' : 'Start XHR Bursts'}
              </button>
              <button
                onClick={stopBursts}
                disabled={!isActive}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Stop Bursts
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Request Timeline</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600 mb-2">Expected behavior:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Requests fire every 400ms for ~3 seconds</li>
              <li>• Each request takes ~200ms to complete</li>
              <li>• DOM updates with count after each request</li>
              <li>• Multiple inflight requests at any given time</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect the repeated inflight requests and DOM churn, 
            and wait for all requests to complete before resolving.
          </p>
        </div>
      </div>
    </div>
  );
}
