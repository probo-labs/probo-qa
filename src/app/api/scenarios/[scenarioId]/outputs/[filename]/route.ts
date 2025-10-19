// API endpoint to serve cached scenario output files (images and JSON)
// GET /api/scenarios/{scenarioId}/outputs/{filename}

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_FILES = [
  'base.png',
  'clickable.png',
  'fillable.png',
  'selectable.png',
  'non-interactive.png',
  'candidates.json'
] as const;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string; filename: string }> }
) {
  const { scenarioId, filename } = await params;

  if (!ALLOWED_FILES.includes(filename as typeof ALLOWED_FILES[number])) {
    return NextResponse.json(
      { error: 'Invalid filename' },
      { status: 400 }
    );
  }

  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const filePath = join(process.cwd(), cacheDir, scenarioId, filename);

  // Check if file exists
  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }

  try {
    const file = readFileSync(filePath);

    // Determine content type
    const contentType = filename.endsWith('.json')
      ? 'application/json'
      : 'image/png';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        // No caching - files can be regenerated at any time
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Failed to serve file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
