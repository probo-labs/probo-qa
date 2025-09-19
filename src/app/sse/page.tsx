'use client';

import { useState, useEffect, useRef } from 'react';

export default function SSEPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessage, setLastMessage] = useState('');
  const [fetchStatus, setFetchStatus] = useState('Not started');
  const eventSourceRef = useRef<EventSource | null>(null);

  const startSSE = () => {
    if (eventSourceRef.current) return;

    setMessageCount(0);
    setLastMessage('');
    setIsConnected(false);
    setFetchStatus('Connecting to SSE stream...');

    const eventSource = new EventSource('/api/stream');
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setFetchStatus('SSE connection established');
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessageCount(prev => prev + 1);
      setLastMessage(data.message);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setFetchStatus('SSE connection error');
    };
  };

  const stopSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setFetchStatus('SSE connection closed');
  };

  const runFetch = async () => {
    setFetchStatus('Running one-time fetch...');
    try {
      const response = await fetch('/api/fetch-test');
      const data = await response.json();
      setFetchStatus(`Fetch completed: ${data.message}`);
    } catch (error) {
      setFetchStatus('Fetch failed');
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-indigo-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8">
          Server-Sent Events Test
        </h1>
        <p className="text-lg text-indigo-700 mb-8">
          This page tests infinite SSE connections and ensures they don't block the waiter forever.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">SSE Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Connection Status:</p>
                <p className="text-lg font-semibold text-gray-800">
                  {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Message Count:</p>
                <p className="text-2xl font-bold text-blue-800">{messageCount}</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-sm text-green-600">Last Message:</p>
                <p className="text-sm font-mono text-green-800 break-all">
                  {lastMessage || 'No messages yet'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>
            <div className="space-y-4">
              <button
                onClick={startSSE}
                disabled={isConnected}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isConnected ? 'SSE Running...' : 'Start SSE Stream'}
              </button>
              <button
                onClick={stopSSE}
                disabled={!isConnected}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Stop SSE Stream
              </button>
              <button
                onClick={runFetch}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Run One-Time Fetch
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Current Status:</p>
            <p className="text-lg font-semibold text-gray-800">{fetchStatus}</p>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect the infinite SSE connection but not wait for it to close. 
            It should resolve after the one-time fetch completes, even though SSE continues streaming.
          </p>
        </div>
      </div>
    </div>
  );
}
