import http from 'http';
import { spawn } from 'child_process';

const mcpServer = spawn('node', ['dist/index.js']);

import { URL } from 'url';

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Bad Request' }));
    return;
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  const apiKey = url.searchParams.get('api_key');

  if (req.headers.authorization !== 'Bearer top-secret' && apiKey !== 'top-secret') {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    mcpServer.stdin.write(body + '\n');
    mcpServer.stdout.once('data', (data) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  });
});

server.listen(8080, () => {
  console.log('HTTP proxy server listening on port 8080');
});
