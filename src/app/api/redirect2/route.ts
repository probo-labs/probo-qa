import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Configurable delay - you can increase this if needed
  const delay = 100; // 100ms delay
  
  // Add the delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Construct absolute URL for redirect
  const url = new URL(request.url);
  const redirectUrl = new URL('/is-page-stable/redirect1', url.origin);
  
  // Return a real HTTP 302 redirect
  return NextResponse.redirect(redirectUrl, 302);
}
