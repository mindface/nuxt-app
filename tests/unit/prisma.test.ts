import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import type { User } from "../../src/types/User";

const prisma = new PrismaClient();

describe('Prisma User Model', () => {
  let testUserId: number;

  beforeAll(async () => {
    // 既存データを削除（外部キー制約を考慮して Task テーブルを先に削除）
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    const uniqueEmail = `test+${Date.now()}@example.com`;
    // テスト用のユーザーを作成
    const user:User = await prisma.user.create({
        data: {
          name: 'Test User',
          email: uniqueEmail,
          password: 'securepassword',
          detail: 'Test user details',
          status: 'active',
          role: 'user',
          isActive: true,
          lastLogin: new Date(),
        }
      });

      testUserId = user.id;
    });
  
    afterAll(async () => {

      // テスト後にデータを削除
      await prisma.task.deleteMany();
      await prisma.user.deleteMany();
      await prisma.$disconnect();
    });

    it('should find a user', async () => {
      const user = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(user).toBeTruthy();
      expect(user?.name).toBe('Test User'); // 期待する値を修正
    });
  

});