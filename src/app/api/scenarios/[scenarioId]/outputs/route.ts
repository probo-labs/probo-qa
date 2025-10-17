// API endpoint to check if scenario outputs exist and return metadata
// GET /api/scenarios/{scenarioId}/outputs

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string }> }
) {
  const { scenarioId } = await params;
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const scenarioDir = join(process.cwd(), cacheDir, scenarioId);
  const metadataPath = join(scenarioDir, 'metadata.json');

  // Check if outputs exist
  if (!existsSync(metadataPath)) {
    return NextResponse.json({ exists: false });
  }

  try {
    // Load and return metadata
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));

    return NextResponse.json({
      exists: true,
      ...metadata
    });
  } catch (error) {
    console.error('Failed to read metadata:', error);
    return NextResponse.json(
      { error: 'Failed to read metadata' },
      { status: 500 }
    );
  }
}
