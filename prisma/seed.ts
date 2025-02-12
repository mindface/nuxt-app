import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // const users = await Promise.all(
  //   Array.from({ length: 200 }, async (_, i) => {
  //     const hashedPassword = await bcrypt.hash(`password${i + 1}`, 10);
  //     return  ({
  //       name: `User${i + 1}`,
  //       email: `test${String(i + 1).padStart(2, '0')}@test.com`,
  //       password: hashedPassword,
  //       detail: `This is user ${i + 1}`,
  //       status: 'active',
  //       role: Math.random() > 0.5 ? 'admin' : 'user',
  //       isActive: true,
  //       lastLogin: new Date(),
  //       tasks: {
  //         create: Array.from({ length: 5 }, (_, j) => ({
  //           title: `Task ${j + 1} for User${i + 1}`,
  //           status: 'pending',
  //           detail: `Detail for Task ${j + 1} of User${i + 1}`,
  //           evaluationFactor: parseFloat((Math.random() * 101).toFixed(2)), // 0.00〜2.00 のランダム値
  //         })),
  //       },
  //     })
  //   })
  // );
  // await prisma.user.createMany({ data: await Promise.all(users) });

  for (let i = 1; i <= 20; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name: `User${i}`,
        email: `test0${i}@test.com`,
        password: hashedPassword,
        detail: `Detail for User${i}`,
        status: "active",
        role: Math.random() > 0.5 ? "admin" : "user",
        isActive: true,
        lastLogin: new Date(),
      },
    });

    // タスクを5つ作成
    await prisma.task.createMany({
      data: Array.from({ length: 5 }).map((_, index) => ({
        title: `Task ${index + 1} for User${i}`,
        status: "pending",
        detail: `Detail for Task ${index + 1} of User${i}`,
        evaluationFactor: Math.floor(Math.random() * 101), // 0-100のランダム値
        userId: user.id, // リレーションを作成
      })),
    });
  }

  console.log('✅ Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
