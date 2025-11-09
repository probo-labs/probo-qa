'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailOtpVerificationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EmailOtpVerificationContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center text-gray-600">Loading verification flow…</div>
    </div>
  );
}

function EmailOtpVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const emailParam = searchParams.get('email') ?? '';
  const email = useMemo(() => emailParam.trim(), [emailParam]);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [hintError, setHintError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      return;
    }

    let cancelled = false;

    const fetchHint = async (showSpinner: boolean) => {
      if (showSpinner) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch(
          `/api/otp/email-login/verify?email=${encodeURIComponent(email)}`,
          { cache: 'no-store' },
        );

        if (!response.ok) {
          if (!cancelled) {
            const payload = await response.json().catch(() => null);
            setHint(null);
            setTimeLeft(null);
            setHintError(payload?.error ?? 'Verification code unavailable. Request a new email.');
          }
          return;
        }

        const data = await response.json();
        if (!cancelled) {
          setHint(data.code);
          setTimeLeft(
            typeof data.remainingMs === 'number'
              ? Math.round(Math.max(0, data.remainingMs) / 1000)
              : null,
          );
          setHintError(null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch OTP', err);
          setHint(null);
          setTimeLeft(null);
          setHintError('Unable to fetch the verification code.');
        }
      } finally {
        if (!cancelled && showSpinner) {
          setIsRefreshing(false);
        }
      }
    };

    fetchHint(false);

    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    if (timeLeft === null) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft !== null]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Missing email. Please start the flow again.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/otp/email-login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Failed to verify code');
      }

      setIsSuccess(true);
      setTimeout(() => router.push('/otp'), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!email) return;
    setIsRefreshing(true);
    try {
      const response = await fetch(
        `/api/otp/email-login/verify?email=${encodeURIComponent(email)}`,
        { cache: 'no-store' },
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setHint(null);
        setTimeLeft(null);
        setHintError(payload?.error ?? 'Verification code unavailable. Request a new email.');
        return;
      }
      const data = await response.json();
      setHint(data.code);
      setTimeLeft(
        typeof data.remainingMs === 'number'
          ? Math.round(Math.max(0, data.remainingMs) / 1000)
          : null,
      );
      setHintError(null);
    } catch (err) {
      console.error('Failed to refresh OTP', err);
      setHint(null);
      setTimeLeft(null);
      setHintError('Unable to fetch the verification code.');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-6xl">📭</div>
          <h1 className="text-2xl font-semibold text-gray-900">Email address missing</h1>
          <p className="text-gray-600">
            We could not determine which email to verify. Please restart the flow from the email
            login page.
          </p>
          <button
            onClick={() => router.push('/otp/email-login')}
            className="inline-flex justify-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Back to Email Login
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h1>
          <p className="text-gray-600 mb-6">
            Your one-time passcode was accepted. Redirecting you back to the OTP catalog…
          </p>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500">Hang tight, this will only take a second.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📨</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Email OTP</h1>
          <p className="text-gray-600">
            We sent a verification code to{' '}
            <span className="font-semibold text-gray-900">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest"
                maxLength={6}
                inputMode="numeric"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Verifying…
                </div>
              ) : (
                'Verify Code'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">⚠️</div>
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-blue-600 mr-2">⏱️</div>
                <span className="text-sm font-medium text-blue-800">
                  {timeLeft !== null ? `Code expires in: ${timeLeft}s` : 'Waiting for code…'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                disabled={isRefreshing}
              >
                {isRefreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>

            {hint && (
              <div className="p-3 bg-white rounded-lg border border-purple-100">
                <p className="text-xs text-purple-700 uppercase tracking-wide mb-1">Demo Code</p>
                <p className="text-2xl font-mono font-bold text-purple-900 tracking-widest">{hint}</p>
                <p className="text-xs text-purple-500 mt-1">
                  This code was delivered to <span className="font-semibold text-purple-700">{email}</span> via Mailpit.
                  The OTP wizard will auto-fill it; copy here if you want to simulate manual entry.
                </p>
              </div>
            )}

            {hintError && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                {hintError}
              </div>
            )}
          </div>
        </div>

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

