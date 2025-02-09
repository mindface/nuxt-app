import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import { createApp, toNodeListener } from 'h3';
import { PrismaClient } from '@prisma/client';
import loginHandler from '../../src/server/api/login';
import { hashPassword } from '../../src/server/utils/bcrypt';

const prisma = new PrismaClient();

const app = createApp();
app.use('/api/login', loginHandler);
const server = toNodeListener(app);

describe('POST /api/login', () => {
  let testUser: { email: string; password: string };
  let testUserId: number;

  beforeAll(async () => {
    // テスト用のユーザーを作成
    testUser = {
      email: 'test@example.com',
      password: 'password123',
    };

    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: testUser.email,
        password: await hashPassword(testUser.password), // パスワードをハッシュ化
        detail: 'Test user details',
        status: 'active',
        role: 'user',
        isActive: true,
        lastLogin: new Date(),
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    // テスト用のデータを削除
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.task.deleteMany(); // タスクがあれば削除
    await prisma.$disconnect();
  });

  it('should return 201 and a token for valid credentials', async () => {
    const response = await request(server)
      .post('/api/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    const res = response.body;

    expect(res.status).toBe(201);
    expect(res).toHaveProperty('user');
    expect(res).toHaveProperty('token');
    expect(res).toHaveProperty('expiresAt');
  });

  it('should return 400 if email or password is missing', async () => {
    const response = await request(server).post('/api/login').send({});
    const res = response.body;
    expect(res.status).toBe(400);
    expect(res.message).toBe('Email and password are required');
  });

  it('should return 500 for invalid credentials', async () => {
    const response = await request(server)
      .post('/api/login')
      .send({ email: 'wrong@example.com', password: 'wrongpassword' });
    const res = response.body;

    expect(res.status).toBe(500);
    expect(res.message).toBe('Internal Server Error');
  });
});