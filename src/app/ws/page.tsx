'use client';

import { useState, useEffect, useRef } from 'react';

export default function WebSocketPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [pingCount, setPingCount] = useState(0);
  const [lastPing, setLastPing] = useState('');
  const [status, setStatus] = useState('Ready to connect');
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current) return;

    setPingCount(0);
    setLastPing('');
    setIsConnected(false);
    setStatus('Connecting to WebSocket...');

    // Use wss:// for production, ws:// for development
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/socket`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatus('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ping') {
        setPingCount(prev => prev + 1);
        setLastPing(data.message);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setStatus('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('WebSocket connection error');
    };
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setStatus('WebSocket disconnected');
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
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
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Status</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">Current Status:</p>
            <p className="text-lg font-semibold text-gray-800">{status}</p>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect the infinite WebSocket connection but not wait for it to close. 
            It should resolve after the page is stable, even though the WebSocket continues sending pings.
          </p>
        </div>
      </div>
    </div>
  );
}
