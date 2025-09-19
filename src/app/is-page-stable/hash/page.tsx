'use client';

import { useEffect, useState } from 'react';

export default function HashPage() {
  const [currentHash, setCurrentHash] = useState('');
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    // Set initial hash
    setCurrentHash(window.location.hash);
    
    // After 500ms, change to #a
    const timer1 = setTimeout(() => {
      window.location.hash = '#a';
      setCurrentHash('#a');
      setStatus('Changed to #a');
    }, 500);

    // After another 500ms (1000ms total), change to #b
    const timer2 = setTimeout(() => {
      window.location.hash = '#b';
      setCurrentHash('#b');
      setStatus('Changed to #b');
    }, 1000);

    // After another 500ms (1500ms total), show calm
    const timer3 = setTimeout(() => {
      setStatus('Calm - no more hash changes');
    }, 1500);

    // Listen for hash changes
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">
          Hash-Only Navigation Test
        </h1>
        <p className="text-lg text-blue-700 mb-8">
          This page tests same-document navigation (SPA-style hash changes).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Current Hash:</p>
                <p className="text-lg font-mono font-semibold">{currentHash || '(empty)'}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Status:</p>
                <p className="text-lg font-semibold text-blue-800">{status}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-sm">0ms</span>
                <span>Page loads</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm">500ms</span>
                <span>Hash changes to #a</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">1000ms</span>
                <span>Hash changes to #b</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">1500ms</span>
                <span>Calm - no more changes</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect same-document navigation (hash changes) 
            and wait for the page to become stable after all hash changes complete.
          </p>
        </div>
      </div>
    </div>
  );
}
