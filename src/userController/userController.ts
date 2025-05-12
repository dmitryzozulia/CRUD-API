import { IncomingMessage, ServerResponse } from 'node:http';
import { users, User } from '../models/user';
import { sendJson } from '../utils/sendJson';
import { randomUUID } from 'node:crypto';

export const getUsers = async (res: ServerResponse) => {
  sendJson(res, 200, users);
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const newUser: User = JSON.parse(body);
      newUser.id = randomUUID();

      if (!newUser.username || !newUser.age || !newUser.hobbies) {
        sendJson(res, 400, 'Invalid user data');
      }
      users.push(newUser);
      process.send?.({ type: 'createUser', data: newUser });
      sendJson(res, 201, 'User created successfully');
    } catch (error) {
      sendJson(res, 400, 'Invalid JSON format');
    }
  });
};

export const getUserById = async (res: ServerResponse, userId: string) => {
  const user = users.find((user) => user.id === userId);
  if (user) {
    sendJson(res, 200, user);
  } else {
    sendJson(res, 404, 'User not found');
  }
};

export const deleteUserById = async (res: ServerResponse, userId: string) => {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    process.send?.({ type: 'deleteUser', data: userId });
    sendJson(res, 200, 'User deleted successfully');
  } else {
    sendJson(res, 404, 'User not found');
  }
};

export const updateUserById = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const updatedUser: User = JSON.parse(body);
      const user = users.find((user) => user.id === userId);
      if (user) {
        user.username = updatedUser.username;
        user.age = updatedUser.age;
        user.hobbies = updatedUser.hobbies;
        process.send?.({ type: 'updateUser', data: user });
        sendJson(res, 200, user);
      } else {
        sendJson(res, 404, 'User not found');
      }
    } catch (error) {
      sendJson(res, 400, 'Invalid JSON format');
    }
  });
};
