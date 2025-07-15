import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage.js';
import { RecordController } from '../controllers/RecordController.js';
import { UILabel } from '../constants/enums.js';
import { SalesforceLeadPage } from '../pages/SalesforceLeadPage.js';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

const createLeadData = {
  leadDetails: {
    [UILabel.LAST_NAME]: faker.person.lastName(),
    [UILabel.EMAIL]: faker.internet.email(),
    [UILabel.COMPANY]: faker.company.name(),
  },
};

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.loginMain(process.env.SF_LOGIN_URL, process.env.SF_USERNAME, process.env.SF_PASSWORD);
});

test.describe('Salesforce UI Automation', () => {
  test('Create Lead record', async ({ page }) => {
    const salesforceLeadPage = new SalesforceLeadPage();
    const leadCreation = new RecordController(page);
    leadCreation.recordData = createLeadData.leadDetails;

    await test.step(`Navigate to Leads creation page`, async () => {
      await salesforceLeadPage.navigateToLeadsPage(page);
    });

    await test.step(`Create a lead`, async () => {
      await leadCreation.createRecord();
    });
  });
});
