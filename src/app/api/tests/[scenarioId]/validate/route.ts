// API Route: Validate test interactions
// GET /api/tests/[scenarioId]/validate
// Validates recorded actions against expected behavior

import { NextRequest, NextResponse } from 'next/server';
import { getSessionId } from '@/lib/session';
import { validateAndUpdateScenario } from '@/lib/scenario-validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scenarioId: string }> }
) {
  try {
    const { scenarioId } = await params;

    // Get session ID from cookie
    const sessionId = await getSessionId();

    // Use shared validation service
    const result = await validateAndUpdateScenario(scenarioId, sessionId);

    // Return validation result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating test:', error);

    // Check if it's a "not found" error
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to validate test' },
      { status: 500 }
    );
  }
}
