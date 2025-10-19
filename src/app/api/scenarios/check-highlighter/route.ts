// API endpoint to check if highlighter script is available
// GET /api/scenarios/check-highlighter

import { existsSync } from 'fs';
import { resolve } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const scriptPath = process.env.HIGHLIGHTER_SCRIPT_PATH;

  // Debug logging for CI
  if (process.env.CI) {
    console.log('[check-highlighter] CI detected');
    console.log('[check-highlighter] HIGHLIGHTER_SCRIPT_PATH:', scriptPath);
    console.log('[check-highlighter] All env vars:', Object.keys(process.env).filter(k => k.includes('HIGHLIGHTER') || k.includes('DATABASE') || k.includes('SCENARIO')));
  }

  if (!scriptPath) {
    return NextResponse.json({
      available: false,
      reason: 'HIGHLIGHTER_SCRIPT_PATH not configured in .env'
    });
  }

  const exists = existsSync(resolve(scriptPath));

  if (!exists) {
    return NextResponse.json({
      available: false,
      reason: `Highlighter script not found at: ${scriptPath}`
    });
  }

  return NextResponse.json({
    available: true,
    path: scriptPath
  });
}
