import cluster from 'node:cluster';
import http from 'node:http';
import { cpus } from 'node:os';
import { router } from './routes/routes';
import { users, User } from './models/user';
import dotenv from 'dotenv';

dotenv.config();
const PORT = Number(process.env.PORT) || 4000;
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process ${process.pid} is running`);

  const messageHandlers: Record<string, (data: any) => void> = {
    createUser: (data) => {
      users.push(data);
    },
    updateUser: (data) => {
      const index = users.findIndex((user) => user.id === data.id);
      if (index !== -1) {
        users[index] = data;
      }
    },
    deleteUser: (id) => {
      const deleteIndex = users.findIndex((user) => user.id === id);
      if (deleteIndex !== -1) {
        users.splice(deleteIndex, 1);
      }
    },
  };

  cluster.on('message', (worker, message) => {
    const handler = messageHandlers[message.type];
    if (handler) {
      handler(message.data);

      for (const id in cluster.workers) {
        cluster.workers[id]?.send({ type: 'syncUsers', data: users });
      }
    }
  });

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
  let currentWorker = 0;
  const loadBalancer = http.createServer((req, res) => {
    const workerIds = Object.keys(cluster.workers || {});
    if (workerIds.length === 0) {
      res.writeHead(500);
      res.end('No workers available');
      return;
    }

    const workerId = workerIds[currentWorker % workerIds.length];
    currentWorker++;

    const options = {
      hostname: 'localhost',
      port: PORT + Number(workerId),
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (workerRes) => {
      res.writeHead(workerRes.statusCode || 500, workerRes.headers);
      workerRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });
  });

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer is running at http://localhost:${PORT}`);
  });
} else {
  const server = http.createServer((req, res) => {
    console.log(
      `Worker ${process.pid} is processing request on port ${
        PORT + (cluster.worker?.id || 0)
      }`,
    );
    router(req, res);
  });

  process.on(
    'message',
    (message: { type: string; data?: Record<string, any>[] }) => {
      if (message.type === 'syncUsers' && message.data) {
        users.length = 0;
        const validUsers = message.data.filter(
          (item): item is User =>
            item.id && item.username && item.age && item.hobbies,
        );
        users.push(...validUsers);
        console.log(`Worker ${process.pid} synchronized users:`, users);
      }
    },
  );

  server.listen(PORT + (cluster.worker?.id || 0), () => {
    console.log(
      `Worker ${process.pid} is running at http://localhost:${
        PORT + (cluster.worker?.id || 0)
      }`,
    );
  });
}
