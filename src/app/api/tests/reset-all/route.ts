// API Route: Reset all tests for current session
// DELETE /api/tests/reset-all

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionId } from '@/lib/session';

export async function POST() {
  try {
    const sessionId = await getSessionId();

    // Delete all test interactions for this session
    const result = await prisma.scenarioInteractionState.deleteMany({
      where: {
        sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Failed to reset all tests:', error);
    return NextResponse.json(
      { error: 'Failed to reset all tests' },
      { status: 500 }
    );
  }
}
