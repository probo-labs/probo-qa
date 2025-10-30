import { NextRequest, NextResponse } from 'next/server';
import { TOTP } from 'otpauth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, secret, digits = 6, algorithm = 'SHA1', window = 1 } = body;

    // Validate required fields
    if (!code || !secret) {
      return NextResponse.json(
        { error: 'Missing required fields: code and secret' },
        { status: 400 }
      );
    }

    // Create TOTP instance with the same parameters as your client code
    const totp = new TOTP({
      algorithm,
      digits,
      secret,
    });

    // Validate the code with a time window (default 1 step = 30 seconds)
    // This allows for slight time differences between client and server
    // Note: validate() returns a number (0 or positive) for valid tokens, null for invalid
    const validationResult = totp.validate({ token: code, window });
    const isValid = validationResult !== null;

    // Get current valid code for debugging/demo purposes
    const currentCode = totp.generate();

    return NextResponse.json({
      valid: isValid,
      currentCode, // For demo purposes - in production, don't return this
      timestamp: Math.floor(Date.now() / 1000),
      window,
      algorithm,
      digits
    });

  } catch (error) {
    console.error('TOTP validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for generating a TOTP code (for demo purposes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret') || 'JBSWY3DPEHPK3PXP'; // Default secret for demo
    const digits = parseInt(searchParams.get('digits') || '6');
    const algorithm = searchParams.get('algorithm') || 'SHA1';

    const totp = new TOTP({
      algorithm,
      digits,
      secret,
    });

    const code = totp.generate();
    const timestamp = Math.floor(Date.now() / 1000);

    return NextResponse.json({
      code,
      secret,
      timestamp,
      algorithm,
      digits,
      remainingTime: 30 - (timestamp % 30) // Seconds until next code
    });

  } catch (error) {
    console.error('TOTP generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
