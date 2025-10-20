// API endpoint to check if highlighter script is available
// GET /api/scenarios/check-highlighter

import { existsSync } from 'fs';
import { resolve } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const scriptPath = process.env.HIGHLIGHTER_SCRIPT_PATH;

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
