import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a prefetch asset
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return NextResponse.json({ 
    message: 'Prefetch asset loaded',
    timestamp: new Date().toISOString(),
    data: 'This is a prefetched asset that should not block the waiter'
  });
}
