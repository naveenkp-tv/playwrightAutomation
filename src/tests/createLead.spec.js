const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { RecordController } = require('../controllers/RecordController');
const { UILabel } = require('../constants/enums');
const { SalesforceLeadPage } = require('../pages/SalesforceLeadPage');
require('dotenv').config();

const { faker } = require('@faker-js/faker');

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
