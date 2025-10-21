// Session management using HTTP-only cookies
// Each browser session gets a unique UUID for tracking test interactions

import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'test_session_id';
// Session expires when browser closes (no maxAge = session-only cookie)

/**
 * Get session ID from cookies (read-only, safe for page components)
 * Returns the session ID if it exists, otherwise returns a default/temporary ID
 * @returns Session UUID or default ID if not set
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  // Return existing session or generate a temporary one
  // Note: The temporary ID should be set by a route handler/server action
  return sessionId || crypto.randomUUID();
}

/**
 * Get or create a session ID (use only in Server Actions or Route Handlers)
 * This function can modify cookies, so it must not be called during page render
 * @returns Session UUID
 */
export async function getOrCreateSessionId(): Promise<string> {
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
