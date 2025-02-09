import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { listen } from 'listhen';
import { createApp, toNodeListener  } from 'h3';
import usersHandler from '../../src/server/api/user';

const prisma = new PrismaClient();
const app = createApp();
app.use('/api/users', usersHandler);

let server: any;

beforeAll(async () => {
  server = await listen(toNodeListener(app));
  await prisma.user.create({ data:
    {
      name: 'E2E Test User',
      email: 'test@example.com',  // @unique 制約のため一意の値
      password: 'securepassword',
      detail: 'Test user details',
      status: 'active',
      role: 'user',
      isActive: true,
      lastLogin: new Date(),
    }
  });
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.$disconnect();
  server.close();
});

describe('GET /api/users - E2E Test', () => {
  it('should return users from the API', async () => {
    const response = await request(server).get('/api/users'); // supertest でリクエスト
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'E2E Test User' }]);
  });
});
