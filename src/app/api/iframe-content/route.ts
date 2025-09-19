import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Same-Origin Iframe</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          margin: 0;
        }
        .container {
          text-align: center;
        }
        .status {
          background: rgba(255,255,255,0.2);
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Same-Origin Iframe</h2>
        <div class="status">
          <p>This iframe will make a fetch request in 1 second...</p>
          <div class="loading"></div>
        </div>
        <div id="result" class="status" style="display: none;">
          <p>Fetch completed!</p>
          <p id="fetchResult"></p>
        </div>
      </div>
      
      <script>
        setTimeout(async () => {
          try {
            const response = await fetch('/api/iframe-fetch');
            const data = await response.json();
            document.getElementById('result').style.display = 'block';
            document.getElementById('fetchResult').textContent = data.message;
          } catch (error) {
            document.getElementById('result').style.display = 'block';
            document.getElementById('fetchResult').textContent = 'Fetch failed: ' + error.message;
          }
        }, 1000);
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
