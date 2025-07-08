require("dotenv").config();
const { test, expect } = require("@playwright/test");
const { SalesforceLeadPage } = require("../pages/SalesforceLeadPage");

let leadPage;

test.beforeEach(async () => {
  leadPage = new SalesforceLeadPage(
    process.env.SF_LOGIN_URL,
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD
  );
  await leadPage.login();
});

test.afterEach(async () => {
  if (leadPage) {
    await leadPage.logout();
  }
});

test("Create Lead in Salesforce and validate recordId", async () => {
  const result = await leadPage.createFakeLead();

  expect(result).toHaveProperty('id');
  expect(result.success).toBe(true);
  expect(result.id).toMatch(/^00Q/);

  // Query and print the created lead's details
  const lead = await leadPage.getLeadById(result.id);
  console.log('Queried Lead:', {
    Id: lead.Id,
    LastName: lead.LastName,
    Company: lead.Company,
    Email: lead.Email
  });

  console.log('Created Lead record Id:', result.id);

  // Assertions for queried lead fields
  expect(lead.Id).toBe(result.id);
  expect(typeof lead.LastName).toBe('string');
  expect(lead.LastName.length).toBeGreaterThan(0);
  expect(typeof lead.Company).toBe('string');
  expect(lead.Company.length).toBeGreaterThan(0);
  expect(typeof lead.Email).toBe('string');
  expect(lead.Email).toMatch(/@/);
});
