// API Route: Reset test state
// POST /api/tests/[scenarioId]/reset
// Deletes all recorded actions for this test + session

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionId } from '@/lib/session';
import { getScenario } from '@/lib/scenarios';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string }> }
) {
  try {
    const { scenarioId } = await params;

    // Validate test exists
    const scenario = getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Get session ID from cookie
    const sessionId = await getSessionId();

    // Delete all actions for this test + session
    const result = await prisma.scenarioInteractionState.deleteMany({
      where: {
        scenarioId,
        sessionId,
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error resetting test:', error);
    return NextResponse.json(
      { error: 'Failed to reset test' },
      { status: 500 }
    );
  }
}
