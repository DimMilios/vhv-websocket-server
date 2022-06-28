import supertest from 'supertest';
import { app } from '../src/server';
const api = supertest(app);

describe('GET /ping', () => {
  it('should return "pong" with status code 200', async () => {
    await api
      .get('/ping')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect(JSON.stringify({ message: 'pong' }));
  });
});
