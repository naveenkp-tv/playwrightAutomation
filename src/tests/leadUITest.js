const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { faker } = require('@faker-js/faker');

let loginPage;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginMain(process.env.SF_LOGIN_URL_UI, process.env.SF_USERNAME, process.env.SF_PASSWORD);
});

test.afterEach(async () => {
  // Assuming logoutMain exists and handles logout
  if (loginPage) {
    await loginPage.logoutMain();
  }
});

test.describe('Lead Management UI Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the Leads tab before each test in this group
    await page.locator('a[title="Leads"]').click();
    await page.waitForURL(/lightning\/o\/Lead\/list/);
  });

  

  test('Navigate to Leads tab and verify title', async ({ page }) => {
    await expect(page.locator('.slds-page-header__title')).toContainText('Leads');
  });

  test('Create a new Lead via UI', async ({ page }) => {
    await page.getByRole('button', { name: 'New' }).click();

    // Wait for the 'New Lead' modal to appear and be ready
    const modal = page.locator('h2.slds-modal__title:has-text("New Lead")');
    await expect(modal).toBeVisible();

    const lastName = faker.person.lastName();
    const company = faker.company.name();

    // Fill out the form using getByLabel for robustness
    await page.getByLabel('Last Name').fill(lastName);
    await page.getByLabel('Company').fill(company);

    // Save the new lead
    await page.getByRole('button', { name: 'Save' }).click();

    // Verify the success toast message
    await expect(page.locator('span.toastMessage')).toContainText(`Lead "${lastName}" was created.`);
  });
});
})

