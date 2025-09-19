import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json({ 
    message: 'Cache test completed',
    timestamp: new Date().toISOString(),
    cached: true
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'ETag': '"cache-test-v1"'
    }
  });
}
