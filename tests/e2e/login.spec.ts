import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

test.describe('Login Page', () => {
  const randomEmail = `user${Date.now()}@example.com`;

  test.beforeEach(async ({ page }) => {    
    await page.goto('http://localhost:3000/login');
  });

  test('サインアップフォームの入力と送信', async ({ page }) => {
    await page.click('.switcher');
    await page.fill('.signup-from input.name', 'Test User');
    await page.fill('.signup-from input.email', randomEmail);
    await page.fill('.signup-from input.password', 'password123');
    await page.fill('.signup-from input.detail', 'Detail info');
    await page.click('.signup-from button');
  });

  test('ログインフォームの入力と送信', async ({ page }) => {
    await page.fill('.login-from input.email', "test01@test.com");
    await page.fill('.login-from input.password', 'password123');
    await page.click('.login-from button');

    // 成功メッセージが表示されるか確認
    await expect(page.locator('.v-toast.v-toast--top .v-toast__text')).toHaveText('ログインしました。');

    await page.waitForURL('http://localhost:3000/');
    await expect(page.url()).toBe('http://localhost:3000/');
  });
});