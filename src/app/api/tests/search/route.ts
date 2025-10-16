// API Route: Search tests by labels
// GET /api/tests/search?label=element_density=sparse&label=action_complexity=single-action
// Returns tests matching ALL provided labels (AND logic)

import { NextRequest, NextResponse } from 'next/server';
import { filterByLabels, TEST_CASES } from '@/lib/scenarios';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const labels = searchParams.getAll('label');

    // If no labels provided, return all tests
    if (labels.length === 0) {
      return NextResponse.json({
        count: Object.keys(TEST_CASES).length,
        tests: Object.values(TEST_CASES).map(t => ({
          id: t.id,
          title: t.title,
          labels: t.labels,
        })),
      });
    }

    // Filter by labels
    const results = filterByLabels(labels);

    return NextResponse.json({
      count: results.length,
      query: labels,
      tests: results.map(t => ({
        id: t.id,
        title: t.title,
        labels: t.labels,
        description: t.description,
      })),
    });
  } catch (error) {
    console.error('Error searching tests:', error);
    return NextResponse.json(
      { error: 'Failed to search tests' },
      { status: 500 }
    );
  }
}
