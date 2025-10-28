'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to TOTP verification page
    router.push('/otp/totp-verification');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Login
          </h1>
          <p className="text-gray-600">
            Enter your email to begin the authentication process
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 mr-2">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Demo Information:</p>
                <p>This is a test scenario for OTP authentication flows. Enter any valid email format to proceed to the TOTP verification step.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to OTP Category */}
        <div className="text-center mt-6">
          <a 
            href="/otp" 
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            ← Back to OTP Authentication
          </a>
        </div>
      </div>
    </div>
  );
}
