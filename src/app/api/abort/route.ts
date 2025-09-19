import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a long delay that will be aborted
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return NextResponse.json({ 
    message: 'This request should be aborted before completion' 
  });
}
