// API endpoint to check if scenario outputs exist and return metadata
// GET /api/scenarios/{scenarioId}/outputs

import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string }> }
) {
  const { scenarioId } = await params;
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const scenarioDir = join(process.cwd(), cacheDir, scenarioId);

  // All required files for cache to be valid
  const requiredFiles = [
    'metadata.json',
    'base.png',
    'clickable.png',
    'fillable.png',
    'selectable.png',
    'non-interactive.png',
    'candidates.json'
  ];

  // Check if ALL files exist
  const allFilesExist = requiredFiles.every(file =>
    existsSync(join(scenarioDir, file))
  );

  if (!allFilesExist) {
    return NextResponse.json({ exists: false });
  }

  try {
    // Load metadata and add file timestamps
    const metadataPath = join(scenarioDir, 'metadata.json');
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    const stats = statSync(metadataPath);

    return NextResponse.json({
      exists: true,
      ...metadata,
      generatedAt: stats.mtime.getTime() // Use filesystem timestamp
    });
  } catch (error) {
    console.error('Failed to read metadata:', error);
    return NextResponse.json(
      { error: 'Failed to read metadata' },
      { status: 500 }
    );
  }
}
