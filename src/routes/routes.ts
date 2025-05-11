import { IncomingMessage, ServerResponse } from 'http';
import { sendJson } from '../utils/sendJson';
import { parse } from 'url';
import { validate as validateUUID } from 'uuid';

export const router = async (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || '', true);
  const method = req.method;

  if (pathname === '/api/users') {
    if (method === 'GET') return console.log('Get all users');
    if (method === 'POST') return console.log('Create a new user');
  }

  if (pathname?.startsWith('api/users/')) {
    const userId = pathname.split('/')[3];
    if (!validateUUID(userId)) {
      return console.log('Invalid UUID format');
    }
  }
  if (pathname?.startsWith('api/users/')) {
    if (method === 'GET') return console.log('Get user by ID');
    if (method === 'PUT') return console.log('Update user by ID');
    if (method === 'DELETE') return console.log('Delete user by ID');
  }
  sendJson(res, 404, { message: 'Not Found' });
};
