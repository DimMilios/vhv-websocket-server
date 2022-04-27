import request from 'supertest';
import prisma from '../src/config/db-client';
import { app } from '../src/server';
import { SeedInclusions, seedValues } from './helpers';
import { expect } from 'chai';

describe('/api/users', () => {
  let agent = request.agent(app);

  beforeEach(async () => {
    let seedIncl: SeedInclusions[] = [
      { entity: 'Document', clean: true },
      { entity: 'User', clean: true },
    ];

    await seedValues(seedIncl);

    await agent.post('/auth/login')
    .send({ email: 'dim@prisma.io', 'current-password': '123' });
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('GET / should fetch all users for the document ID provided', async() => {
    let res = await agent
      .get('/api/users')
      .query({ docId: 1 })
      .expect('Content-Type', /json/)

    expect(res.body).to.have.lengthOf(3);
  });
});
