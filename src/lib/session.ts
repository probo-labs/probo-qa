// Session management using HTTP-only cookies
// Each browser session gets a unique UUID for tracking test interactions

import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'test_session_id';
// Session expires when browser closes (no maxAge = session-only cookie)

/**
 * Get or create a session ID from cookies
 * @returns Session UUID
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    // Generate new UUID
    sessionId = crypto.randomUUID();

    // Store in session-only cookie (expires when browser closes)
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // No maxAge = session cookie (deleted when browser closes)
      path: '/',
    });
  }

  return sessionId;
}

/**
 * Clear session cookie (logout/reset)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
