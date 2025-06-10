import http from 'http';
import { spawn } from 'child_process';

const mcpServer = spawn('node', ['dist/index.js']);

const server = http.createServer((req, res) => {
  if (req.headers.authorization !== 'Bearer top-secret') {
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
