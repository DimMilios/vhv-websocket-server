import request from 'supertest';
import prisma from '../src/config/db-client';
import { app } from '../src/server';
import { resetAll, SeedInclusions, seedValues } from './helpers';
import { expect } from 'chai';

describe('/auth', () => {
  beforeEach(async () => {
    let seedIncl: SeedInclusions[] = [
      { entity: 'Document', clean: true },
      { entity: 'User', clean: true },
    ];

    await resetAll();
    await seedValues(seedIncl);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('POST /login should log the user in given correct credentials', async () => {
    let res = await request(app)
      .post('/auth/login')
      .send({ email: 'dim@prisma.io', 'current-password': '123' });

    expect(res.headers['set-cookie'].find((cookie: string) => cookie.startsWith('auth')), 'auth cookie').not.to.be.undefined;
  });
  
  it('POST /login should set user cookie given correct credentials', async () => {
    let res = await request(app)
      .post('/auth/login')
      .send({ email: 'dim@prisma.io', 'current-password': '123' });

    expect(res.headers['set-cookie'].find((cookie: string) => cookie.startsWith('user')), 'user cookie').not.to.be.undefined;
  });
});
