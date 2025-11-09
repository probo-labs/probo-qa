import { NextResponse } from 'next/server';
import { consumeOtp, getOtp } from '../store';

export async function POST(request: Request) {
  let body: { email?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim();
  const code = body.code?.trim();

  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
  }

  const result = consumeOtp(email, code);

  switch (result) {
    case 'missing':
      return NextResponse.json({ error: 'No OTP found for this email. Request a new code.' }, { status: 404 });
    case 'expired':
      return NextResponse.json({ error: 'OTP has expired. Request a new code.' }, { status: 410 });
    case 'invalid':
      return NextResponse.json({ error: 'Incorrect code. Please try again.' }, { status: 401 });
    case 'ok':
      return NextResponse.json({ ok: true });
    default:
      return NextResponse.json({ error: 'Unable to verify code.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const record = getOtp(email);

  if (!record) {
    return NextResponse.json({ error: 'No OTP available for this email' }, { status: 404 });
  }

  const remainingMs = Math.max(0, record.expiresAt - Date.now());

  return NextResponse.json({
    code: record.code,
    expiresAt: record.expiresAt,
    remainingMs,
  });
}

