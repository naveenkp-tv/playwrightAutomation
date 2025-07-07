require("dotenv").config();
const { test, expect } = require("@playwright/test");
const { SalesforceLeadPage } = require("../pages/SalesforceLeadPage");

test("Create Lead in Salesforce and validate recordId", async () => {
  const leadPage = new SalesforceLeadPage(
    process.env.SF_LOGIN_URL,
    process.env.SF_USERNAME,
    process.env.SF_PASSWORD
  );
  await leadPage.login();
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
});
