import http, { IncomingMessage, ServerResponse } from 'http';
import { router } from './routes/routes';
// import { parse } from 'url';
import dotenv from 'dotenv';
// import { validate as isValidUUID } from 'uuid';
// import { randomUUID } from 'crypto';

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  router(req, res);
});

// const server = http.createServer(
//   (req: IncomingMessage, res: ServerResponse) => {
//     const { pathname } = parse(req.url || '', true);

//     if (pathname === '/api/users' && req.method === 'GET') {
//       res.writeHead(200, { 'Content-Type': 'application/json' });
//       res.end(JSON.stringify({ message: users }));
//       return;
//     }

//     if (pathname?.startsWith('/api/users/') && req.method === 'GET') {
//       const userId = pathname.split('/')[3];
//       const user = users.find((user) => user.id === userId);
//       if (!isValidUUID(userId)) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Invalid UUID format' }));
//         return;
//       }
//       if (user) {
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: user }));
//       } else {
//         res.writeHead(404, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'User not found' }));
//       }
//       return;
//     }

//     if (pathname === '/api/users' && req.method === 'POST') {
//       let body = '';
//       req.on('data', (chunk) => {
//         body += chunk.toString();
//       });
//       req.on('end', () => {
//         try {
//           const newUser: User = JSON.parse(body);
//           newUser.id = randomUUID();
//           console.log(newUser);
//           if (!newUser.username || !newUser.age || !newUser.hobbies) {
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: 'Invalid user data' }));
//             return;
//           }
//           users.push(newUser);
//           res.writeHead(201, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ message: newUser }));
//         } catch (error) {
//           res.writeHead(400, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ message: 'Invalid JSON format' }));
//         }
//       });
//       return;
//     }
//     if (pathname?.startsWith('/api/users/') && req.method === 'PUT') {
//       let body = '';
//       req.on('data', (chunk) => {
//         body += chunk.toString();
//       });
//       req.on('end', () => {
//         try {
//           const userId = pathname.split('/')[3];
//           if (!isValidUUID(userId)) {
//             res.writeHead(400, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: 'Invalid UUID format' }));
//             return;
//           }

//           const updatedUser: User = JSON.parse(body);
//           const user = users.find((user) => user.id === userId);

//           if (user) {
//             user.username = updatedUser.username;
//             user.age = updatedUser.age;
//             user.hobbies = updatedUser.hobbies;
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: user }));
//             return;
//           } else {
//             res.writeHead(404, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify({ message: 'User not found' }));
//             return;
//           }
//         } catch (error) {
//           res.writeHead(400, { 'Content-Type': 'application/json' });
//           res.end(JSON.stringify({ message: 'Invalid JSON format' }));
//           return;
//         }
//       });
//       return;
//     }
//     if (pathname?.startsWith('/api/users/') && req.method === 'DELETE') {
//       const userId = pathname.split('/')[3];
//       if (!isValidUUID(userId)) {
//         res.writeHead(400, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'Invalid UUID format' }));
//         return;
//       }
//       const userIndex = users.findIndex((user) => user.id === userId);
//       if (userIndex !== -1) {
//         users.splice(userIndex, 1);
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'User deleted successfully' }));
//       } else {
//         res.writeHead(404, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ message: 'User not found' }));
//       }
//       return;
//     }
//     res.writeHead(404, { 'Content-Type': 'text/plain' });
//     res.end(JSON.stringify({ message: 'Route not found' }));
//   },
// );

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error('Error starting the server:', error);
});
