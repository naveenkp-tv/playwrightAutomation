import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.loginMain(process.env.SF_LOGIN_URL, process.env.SF_USERNAME, process.env.SF_PASSWORD);
});

test.describe('Salesforce UI Automation', () => {
  test('Basic Test - Validate the Profile is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'View profile' })).toBeVisible();
  });
});
