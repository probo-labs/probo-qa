import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a delay before returning 500
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json(
    { message: 'This endpoint should return 500' },
    { status: 500 }
  );
}
