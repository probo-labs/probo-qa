import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a 1 second delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return NextResponse.json({ 
    message: 'One-time fetch completed successfully',
    timestamp: new Date().toISOString()
  });
}
