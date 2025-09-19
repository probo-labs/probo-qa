import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      let messageCount = 0;
      
      const sendMessage = () => {
        messageCount++;
        const message = {
          message: `SSE message #${messageCount} at ${new Date().toISOString()}`,
          count: messageCount,
          timestamp: new Date().toISOString()
        };
        
        const data = `data: ${JSON.stringify(message)}\n\n`;
        controller.enqueue(encoder.encode(data));
      };

      // Send first message immediately
      sendMessage();
      
      // Send messages every 2 seconds
      const interval = setInterval(sendMessage, 2000);
      
      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
