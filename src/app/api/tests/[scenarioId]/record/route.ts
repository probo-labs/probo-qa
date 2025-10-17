// API Route: Record test interaction
// POST /api/tests/[scenarioId]/record
// Records an action immediately when user interacts with an element

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionId } from '@/lib/session';
import { getScenario } from '@/lib/scenarios';
import { validateAndUpdateScenario } from '@/lib/scenario-validation';
import type { ActionType } from '@/types/scenario';

interface RecordRequestBody {
  action: ActionType;
  element: string;
  value?: string;
}

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

    // Parse request body
    const body: RecordRequestBody = await request.json();
    const { action, element, value } = body;

    // Validate required fields
    if (!action || !element) {
      return NextResponse.json(
        { error: 'Missing required fields: action, element' },
        { status: 400 }
      );
    }

    // Get session ID from cookie
    const sessionId = await getSessionId();

    // Record interaction in database
    await prisma.scenarioInteractionState.create({
      data: {
        scenarioId,
        sessionId,
        actionPerformed: action,
        elementInteracted: element,
        valueFilled: value || null,
        isCorrect: false, // Will be determined during validation
        metadata: {
          recordedVia: 'immediate_action',
          userAgent: request.headers.get('user-agent') || undefined,
        },
      },
    });

    // Validate and return the updated validation result
    const validationResult = await validateAndUpdateScenario(scenarioId, sessionId);

    return NextResponse.json({
      success: true,
      validation: validationResult
    });
  } catch (error) {
    console.error('Error recording action:', error);
    return NextResponse.json(
      { error: 'Failed to record action' },
      { status: 500 }
    );
  }
}
