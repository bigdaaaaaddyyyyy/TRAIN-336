// server.js - A raw Node.js HTTP server with 3 routes. No Express.
// Run with: npm start

// ES module import (works because package.json has "type": "module").
// The 'node:' prefix marks a built-in core module, not an npm package.
import http from 'node:http';

// 'os' gives info about the machine running Node. Used in route 3.
import os from 'node:os';

// Hosting platforms set PORT; locally we fall back to 3000.
const PORT = process.env.PORT || 3000;

// Helper: send a JSON response (status code + headers + body).
function sendJson(res, statusCode, data) {
  // HTTP bodies are text, so turn the JS object into a JSON string.
  const body = JSON.stringify(data, null, 2);
  // writeHead sets status and headers BEFORE the body is sent.
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  // end() sends the body and closes the response. Forget it and the
  // client hangs forever.
  res.end(body);
}

// createServer takes a callback that Node runs on EVERY request.
// req = incoming request, res = outgoing response.
// The event loop keeps the thread free and calls this when a request arrives.
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // req.url is only path + query, so give URL a base to parse it.
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Routing by hand: check method AND path.

  // ROUTE 1: GET /  -> plain text
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from raw Node.js! Try /hello?name=Jamil and /info');
    return; // stop so we don't fall through to other routes
  }

  // ROUTE 2: GET /hello?name=Jamil  -> JSON using a query param
  if (req.method === 'GET' && url.pathname === '/hello') {
    // get() returns null if the param is missing, so default it.
    const name = url.searchParams.get('name') || 'stranger';
    sendJson(res, 200, {
      message: `Hello, ${name}!`,
      time: new Date().toISOString(),
    });
    return;
  }

  // ROUTE 3: GET /info  -> machine info from the os module
  if (req.method === 'GET' && url.pathname === '/info') {
    sendJson(res, 200, {
      nodeVersion: process.version,
      platform: os.platform(),
      cpuCores: os.cpus().length,
      totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024), // bytes -> MB
      uptimeSeconds: Math.round(process.uptime()),
    });
    return;
  }

  // FALLBACK: always answer unknown URLs, or they hang.
  sendJson(res, 404, { error: 'Not found', path: url.pathname });
});

// listen() is non-blocking. The open server keeps the process alive
// because the event loop sees it as an active handle.
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});