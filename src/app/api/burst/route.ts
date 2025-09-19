import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a ~200ms delay for each request
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const timestamp = new Date().toISOString();
  const message = `Burst request completed at ${timestamp}`;
  
  return NextResponse.json({ 
    message,
    timestamp,
    success: true 
  });
}
