'use client';

import { useEffect } from 'react';

export default function Redirect1Page() {
  useEffect(() => {
    // Navigate to the API route which will return a real HTTP 302 redirect
    window.location.href = '/api/redirect1';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Redirecting...
        </h1>
        <p className="text-gray-600">
          You should be redirected to the final page.
        </p>
      </div>
    </div>
  );
}
