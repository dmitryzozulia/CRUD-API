import request from 'supertest';
import http from 'http';
import { router } from '../routes/routes';

const server = http.createServer((req, res) => {
  router(req, res);
});

describe('API Tests', () => {
  it('should return 200 for GET /api/users', async () => {
    const response = await request(server).get('/api/users');
    expect(response.status).toBe(200);
  });

  it('should return an empty array', async () => {
    const response = await request(server).get('/api/users');
    expect(response.body.message).toEqual([]);
  });

  it('should create a new user with POST /api/users', async () => {
    const newUser = {
      username: 'Alex',
      age: 28,
      hobbies: ['coding', 'reading'],
    };
    const response = await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should return updated user with the same id with PUT', async () => {
    const newUser = {
      username: 'Alex',
      age: 28,
      hobbies: ['coding', 'reading'],
    };
    await request(server)
      .post('/api/users')
      .send(newUser)
      .set('Content-Type', 'application/json');
    const getResponse = await request(server).get('/api/users');
    const userId = getResponse.body.message[0].id;
    const updatedUser = {
      username: 'Alex',
      age: 29,
      hobbies: ['coding', 'reading', 'cooking'],
    };
    const updateResponse = await request(server)
      .put(`/api/users/${userId}`)
      .send(updatedUser);
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toMatchObject(updatedUser);
  });

  it('should return 404 for unknown route', async () => {
    const response = await request(server).get('/unknown');
    expect(response.status).toBe(404);
  });
});
