import { test, expect } from '@playwright/test';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

test.describe('Task Page', () => {

  test('タスクフォームの入力と送信', async ({ page }) => {
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

    await page.fill('.login-from input.email', 'test01@test.com');
    await page.fill('.login-from input.password', 'password123');
    await page.click('.login-from button');
    await page.waitForURL('http://localhost:3000/');

    await page.goto('http://localhost:3000/task', { waitUntil: 'networkidle' });
    await page.fill('.parts-task-form-field input.title', 'new task 111');

    // テキストエリアの入力
    await page.locator('.parts-task-form-field textarea').click();
    await page.locator('.parts-task-form-field textarea').type('new detail 111');
    await page.fill('.parts-task-form-field input.evaluationFactor', '50');
    await page.locator('.parts-task-form-field input.evaluationFactor').blur();
 
    await expect(page.locator('.parts-task-form-field .btn')).toBeVisible({ timeout: 5000 });
    await page.click('.parts-task-form-field .btn');

    // タスクがリストに追加されたか確認
    const taskCountBefore = await page.locator('.task-box > *').count();
    await page.waitForFunction(
     async (previousCount) => {
        const elements = document.querySelectorAll('.task-box > *');
        return elements.length > previousCount;
      },
      taskCountBefore,
      { timeout: 10000 }
    );
    const taskList = page.locator('.task-box');
    await expect(taskList).toContainText('new task 111');
    // await expect(taskList).toContainText('50');

    // await page.click('.signup-from button');

  });
  
});