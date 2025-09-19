import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a delay for the iframe fetch
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return NextResponse.json({ 
    message: 'Iframe fetch completed successfully!',
    timestamp: new Date().toISOString()
  });
}
