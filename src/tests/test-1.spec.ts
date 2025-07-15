const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
require('dotenv').config();

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.loginMain(process.env.SF_LOGIN_URL, process.env.SF_USERNAME, process.env.SF_PASSWORD);
});

test.describe('Salesforce UI Automation', () => {
  test('Basic Test - Validate the Profile is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'View profile' })).toBeVisible();
  });
});
