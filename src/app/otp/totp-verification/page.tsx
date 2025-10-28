'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TotpVerificationPage() {
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentCode, setCurrentCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Demo secret - in production, this would be user-specific
  const DEMO_SECRET = 'JBSWY3DPEHPK3PXP'; // Base32 encoded "Hello!"

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Reset timer when it reaches 0
      setTimeLeft(30);
      fetchCurrentCode(); // Fetch new code
    }
  }, [timeLeft]);

  // Fetch current valid TOTP code from server
  const fetchCurrentCode = async () => {
    try {
      const response = await fetch(`/api/validate-totp?secret=${DEMO_SECRET}`);
      const data = await response.json();
      if (data.code) {
        setCurrentCode(data.code);
        setTimeLeft(data.remainingTime || 30);
      }
    } catch (error) {
      console.error('Failed to fetch current TOTP code:', error);
    }
  };

  // Generate initial code
  useEffect(() => {
    fetchCurrentCode();
  }, []);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/validate-totp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: totpCode,
          secret: DEMO_SECRET,
          digits: 6,
          algorithm: 'SHA1',
          window: 1 // Allow 1 step (30 seconds) tolerance
        }),
      });

      const data = await response.json();
      
      if (data.valid) {
        setIsSuccess(true);
        // Redirect to success page or back to main after 2 seconds
        setTimeout(() => {
          router.push('/otp');
        }, 2000);
      } else {
        setError('Invalid TOTP code. Please try again.');
        setTotpCode('');
      }
    } catch (error) {
      console.error('TOTP validation error:', error);
      setError('Failed to validate code. Please try again.');
    }
    
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Authentication Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            You have successfully completed the TOTP verification process.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500">
              Redirecting back to OTP category...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔢</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TOTP Verification
          </h1>
          <p className="text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        {/* TOTP Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label htmlFor="totp" className="block text-sm font-medium text-gray-700 mb-2">
                TOTP Code
              </label>
              <input
                type="text"
                id="totp"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || totpCode.length !== 6}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify TOTP'
              )}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">❌</div>
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Timer Display */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-blue-600 mr-2">⏰</div>
                <span className="text-sm font-medium text-blue-800">
                  Code expires in: {timeLeft}s
                </span>
              </div>
              <div className="w-16 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <div className="text-yellow-600 mr-2">🔑</div>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Demo TOTP Code:</p>
                <p className="font-mono text-lg font-bold">{currentCode || 'Loading...'}</p>
                <p className="text-xs mt-1">Use this code to test the verification process</p>
                <p className="text-xs mt-1 text-yellow-700">
                  Secret: {DEMO_SECRET} (Base32 encoded "Hello!")
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to OTP Category */}
        <div className="text-center mt-6">
          <a 
            href="/otp" 
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            ← Back to OTP Authentication
          </a>
        </div>
      </div>
    </div>
  );
}
