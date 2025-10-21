import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'test_session_id';

/**
 * Get session ID from cookies (read-only)
 *
 * @returns Session UUID, or temporary UUID if session does not exist
 */
export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return sessionId || crypto.randomUUID();
}

/**
 * Get or create a session ID
 *
 * Creates a new session if one does not exist. Use in route handlers and server actions.
 *
 * @returns Session UUID
 */
export async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return sessionId;
}

/**
 * Clear session cookie
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
