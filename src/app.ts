import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

const PORT = process.env.PORT || 3000;

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const { pathname } = parse(req.url || '', true);

    if (pathname === '/api/hello') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Hello, World!!!' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  },
);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
