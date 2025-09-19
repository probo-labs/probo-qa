'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function SPAPage() {
  const [currentView, setCurrentView] = useState('home');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready to test SPA navigation');

  const handleNavigateToUsers = async () => {
    setLoading(true);
    setStatus('Navigating to /spa/users...');
    
    // Simulate SPA navigation with pushState
    window.history.pushState({}, '', '/spa/users');
    setCurrentView('users');
    
    try {
      setStatus('Fetching users from /api/users...');
      const response = await fetch('/api/users');
      const userData = await response.json();
      setUsers(userData);
      setStatus('Users loaded successfully!');
    } catch (error) {
      setStatus('Error loading users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/spa');
    setCurrentView('home');
    setStatus('Back to home view');
  };

  return (
    <div className="min-h-screen p-8 bg-purple-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-900 mb-8">
          SPA PushState Test
        </h1>
        <p className="text-lg text-purple-700 mb-8">
          This page tests SPA soft navigation with pushState and delayed XHR requests.
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p className="text-sm text-gray-600">Status:</p>
            <p className="text-lg font-semibold text-gray-800">{status}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-sm text-blue-600">Current View:</p>
            <p className="text-lg font-semibold text-blue-800">{currentView}</p>
          </div>
        </div>

        {currentView === 'home' ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Home View</h2>
            <p className="text-gray-700 mb-6">
              Click the button below to test SPA navigation with pushState and a delayed API call.
            </p>
            <button
              onClick={handleNavigateToUsers}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'Navigate to Users'}
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Users View</h2>
            <button
              onClick={handleBackToHome}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-6"
            >
              ← Back to Home
            </button>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">User List</h3>
                <div className="grid gap-4">
                  {users.map((user) => (
                    <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Expected Behavior
          </h3>
          <p className="text-yellow-700">
            The waiter should detect the pushState navigation and wait for the delayed 
            fetch('/api/users') request to complete before resolving.
          </p>
        </div>
      </div>
    </div>
  );
}
