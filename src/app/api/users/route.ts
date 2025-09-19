import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate a 1-2 second delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com' },
  ];
  
  return NextResponse.json(users);
}
