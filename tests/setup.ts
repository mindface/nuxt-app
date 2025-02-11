import { config } from 'dotenv';
import { execSync } from 'child_process';

// .env.test ファイルを読み込む
config({ path: '.env.test' });
// const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL };
console.log('DATABASE_URL:', process.env.DATABASE_URL);
try {
  // データベースのリセット（強制的にマイグレーションを適用）
  process.env.DATABASE_URL = 'postgresql://root:1234ewq1@localhost:5432/test_db?schema=public';

  console.log('Resetting database...');
  execSync('DATABASE_URL="postgresql://root:1234ewq1@localhost:5432/test_db?schema=public" npx prisma migrate deploy', { stdio: 'inherit' });
  execSync('DATABASE_URL="postgresql://root:1234ewq1@localhost:5432/test_db?schema=public" npx prisma migrate reset -f --skip-seed', { stdio: 'inherit' });
  // execSync('DATABASE_URL="postgresql://root:1234ewq1@localhost:5432/test_db?schema=public" npx prisma migrate dev --force', { stdio: 'inherit' });

  // シードデータの挿入（マイグレーション後）
  // execSync('DATABASE_URL="postgresql://root:1234ewq1@localhost:5432/test_db?schema=public" yarn tsx prisma/seed.ts', { stdio: 'inherit' });

} catch (error) {
  console.error('Error during database reset or seeding:', error);
  process.exit(1);  // エラーが発生した場合、プロセスを終了
}
