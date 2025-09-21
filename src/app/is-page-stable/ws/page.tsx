'use client';

import { useState, useEffect, useRef } from 'react';

interface MockWebSocket {
  readyState: number;
  close: () => void;
  send: () => void;
  pingInterval?: NodeJS.Timeout;
}

export default function WebSocketPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [pingCount, setPingCount] = useState(0);
  const [lastPing, setLastPing] = useState('');
  const [status, setStatus] = useState('Ready to connect');
  const [fetchStatus, setFetchStatus] = useState('Not started');
  const wsRef = useRef<WebSocket | MockWebSocket | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current) return;

    setPingCount(0);
    setLastPing('');
    setIsConnected(false);
    setStatus('Connecting to WebSocket...');

    // Create a mock WebSocket that simulates the behavior for testing
    // In a real app, you'd use a proper WebSocket server
    const mockWebSocket: MockWebSocket = {
      readyState: WebSocket.CONNECTING,
      close: () => {
        mockWebSocket.readyState = WebSocket.CLOSED;
        setIsConnected(false);
        setStatus('WebSocket disconnected');
      },
      send: () => {} // Mock send method
    };

    // Simulate connection after a short delay
    setTimeout(() => {
      mockWebSocket.readyState = WebSocket.OPEN;
      setIsConnected(true);
      setStatus('WebSocket connected');
      
      // Start sending ping messages every 2 seconds
      const pingInterval = setInterval(() => {
        if (mockWebSocket.readyState === WebSocket.OPEN) {
          const pingData = {
            type: 'ping',
            message: `Ping #${pingCount + 1} at ${new Date().toISOString()}`
          };
          
          // Simulate receiving a message
          setPingCount(prev => prev + 1);
          setLastPing(pingData.message);
        } else {
          clearInterval(pingInterval);
        }
      }, 2000);
      
      // Store interval for cleanup
      mockWebSocket.pingInterval = pingInterval;
    }, 500);

    wsRef.current = mockWebSocket;
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      // Clear the ping interval if it exists
      const mockWs = wsRef.current as MockWebSocket;
      if (mockWs.pingInterval) {
        clearInterval(mockWs.pingInterval);
      }
      
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setStatus('WebSocket disconnected');
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
      if (wsRef.current) {
        // Clear the ping interval if it exists
        const mockWs = wsRef.current as MockWebSocket;
        if (mockWs.pingInterval) {
          clearInterval(mockWs.pingInterval);
        }
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-teal-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-teal-900 mb-8">
          WebSocket Test
        </h1>
        <p className="text-lg text-teal-700 mb-8">
          This page tests infinite WebSocket connections and ensures they don&apos;t block the waiter forever.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">WebSocket Status</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-sm text-gray-600">Connection Status:</p>
                <p className="text-lg font-semibold text-gray-800">
                  {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded">
                <p className="text-sm text-blue-600">Ping Count:</p>
                <p className="text-2xl font-bold text-blue-800">{pingCount}</p>
              </div>
              <div className="bg-green-100 p-4 rounded">
                <p className="text-sm text-green-600">Last Ping:</p>
                <p className="text-sm font-mono text-green-800 break-all">
                  {lastPing || 'No pings yet'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Controls</h2>
            <div className="space-y-4">
              <button
                onClick={connectWebSocket}
                disabled={isConnected}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isConnected ? 'WebSocket Running...' : 'Connect WebSocket'}
              </button>
              <button
                onClick={disconnectWebSocket}
                disabled={!isConnected}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Disconnect WebSocket
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">WebSocket Status:</p>
              <p className="text-lg font-semibold text-gray-800">{status}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Fetch Status:</p>
              <p className="text-lg font-semibold text-gray-800">{fetchStatus}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect the infinite WebSocket connection but not wait for it to close. 
            It should resolve after the one-time fetch completes, even though the WebSocket continues sending pings.
          </p>
        </div>
      </div>
    </div>
  );
}
