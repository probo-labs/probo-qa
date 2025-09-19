'use client';

import { useState, useEffect, useRef } from 'react';

export default function DOMChurnPage() {
  const [isActive, setIsActive] = useState(false);
  const [nodeCount, setNodeCount] = useState(0);
  const [status, setStatus] = useState('Ready to start DOM churn');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startDOMChurn = () => {
    if (isActive) return;

    setIsActive(true);
    setNodeCount(0);
    setStatus('Starting DOM churn - adding/removing nodes every 200ms...');

    // Clear any existing nodes
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    intervalRef.current = setInterval(() => {
      if (containerRef.current) {
        // Remove all existing nodes
        containerRef.current.innerHTML = '';
        
        // Add new nodes (random number between 5-15)
        const nodeCount = Math.floor(Math.random() * 11) + 5;
        setNodeCount(nodeCount);
        
        for (let i = 0; i < nodeCount; i++) {
          const node = document.createElement('div');
          node.className = 'bg-blue-100 border border-blue-300 rounded p-2 mb-2';
          node.textContent = `DOM Node ${i + 1} - ${new Date().toISOString()}`;
          containerRef.current.appendChild(node);
        }
      }
    }, 200);

    // Stop after 2 seconds
    setTimeout(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsActive(false);
      setStatus('DOM churn complete - showing final state');
    }, 2000);
  };

  const stopDOMChurn = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
    setStatus('DOM churn stopped manually');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-pink-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-900 mb-8">
          DOM Churn Test
        </h1>
        <p className="text-lg text-pink-700 mb-8">
          This page tests DOM stability by continuously adding and removing nodes without network requests.
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
                <p className="text-sm text-blue-600">Current Node Count:</p>
                <p className="text-2xl font-bold text-blue-800">{nodeCount}</p>
              </div>
              <div className="bg-pink-100 p-4 rounded">
                <p className="text-sm text-pink-600">Active:</p>
                <p className="text-lg font-semibold text-pink-800">
                  {isActive ? '🟢 Running' : '🔴 Stopped'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>
            <div className="space-y-4">
              <button
                onClick={startDOMChurn}
                disabled={isActive}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isActive ? 'DOM Churn Running...' : 'Start DOM Churn'}
              </button>
              <button
                onClick={stopDOMChurn}
                disabled={!isActive}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Stop DOM Churn
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">DOM Container</h2>
          <div 
            ref={containerRef}
            className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
          >
            {!isActive && nodeCount === 0 && (
              <p className="text-gray-500 text-center">DOM nodes will appear here when churn starts</p>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should respect DOM stability, not just network idle. 
            It should wait for DOM changes to settle before resolving.
          </p>
        </div>
      </div>
    </div>
  );
}
