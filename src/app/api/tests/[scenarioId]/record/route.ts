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
    const scenario = getScenario(scenarioId);

    if (!scenario) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    const { action, element, value }: RecordRequestBody = await request.json();

    if (!action || !element) {
      return NextResponse.json({ error: 'Missing required fields: action, element' }, { status: 400 });
    }

    const sessionId = await getSessionId();

    await prisma.scenarioInteractionState.create({
      data: {
        scenarioId,
        sessionId,
        actionPerformed: action,
        elementInteracted: element,
        valueFilled: value || null,
        metadata: {
          recordedVia: 'immediate_action',
          userAgent: request.headers.get('user-agent') || undefined,
        },
      },
    });

    const validationResult = await validateAndUpdateScenario(scenarioId, sessionId);

    return NextResponse.json({
      success: true,
      validation: validationResult
    });
  } catch (error) {
    console.error('Error recording action:', error);
    return NextResponse.json({ error: 'Failed to record action' }, { status: 500 });
  }
}
