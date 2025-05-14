import http from 'node:http';
import { router } from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('Error starting the server:', error);
});
