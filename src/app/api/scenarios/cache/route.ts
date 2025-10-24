// API endpoint to manage highlighter cache
// DELETE /api/scenarios/cache - Delete all scenario caches

import { NextResponse } from 'next/server';
import { rmSync, existsSync } from 'fs';
import { join } from 'path';

export async function DELETE() {
  const cacheDir = process.env.SCENARIO_CACHE_DIR || '.cache/scenarios';
  const cachePath = join(process.cwd(), cacheDir);

  try {
    if (existsSync(cachePath)) {
      rmSync(cachePath, { recursive: true, force: true });
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully'
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Cache was already empty'
      });
    }
  } catch (error) {
    console.error('Failed to delete cache:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete cache',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
