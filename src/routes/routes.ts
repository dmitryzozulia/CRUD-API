import { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson } from '../utils/sendJson';
import { parse } from 'node:url';
import { validate as validateUUID } from 'uuid';
import {
  getUsers,
  createUser,
  getUserById,
  deleteUserById,
  updateUserById,
} from '../userController/userController';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || '', true);
  const method = req.method;

  if (pathname === '/api/users') {
    if (method === 'GET') return await getUsers(res);
    if (method === 'POST') return await createUser(req, res);
  }
  console.log('Pathname:', pathname);
  if (pathname?.startsWith('/api/users/')) {
    const userId = pathname.split('/')[3];

    if (!validateUUID(userId)) {
      return sendJson(res, 400, 'Invalid UUID format');
    }

    if (method === 'GET') {
      return await getUserById(res, userId);
    }
    if (method === 'PUT') return updateUserById(req, res, userId);
    if (method === 'DELETE') return await deleteUserById(res, userId);
  }
  sendJson(res, 404, { message: 'Not Found' });
};
