require("dotenv").config();
const { test, expect } = require("@playwright/test");
const { SalesforceLeadPage } = require("../pages/SalesforceLeadPage");
const { faker } = require("@faker-js/faker");

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

  expect(result).toHaveProperty("id");
  expect(result.success).toBe(true);
  expect(result.id).toMatch(/^00Q/);

  // Query and print the created lead's details
  const lead = await leadPage.getLeadById(result.id);
  console.log("Queried Lead:", {
    Id: lead.Id,
    LastName: lead.LastName,
    Company: lead.Company,
    Email: lead.Email,
  });

  console.log("Created Lead record Id:", result.id);

  // Assertions for queried lead fields
  expect(lead.Id).toBe(result.id);
  expect(typeof lead.LastName).toBe("string");
  expect(lead.LastName.length).toBeGreaterThan(0);
  expect(typeof lead.Company).toBe("string");
  expect(lead.Company.length).toBeGreaterThan(0);
  expect(typeof lead.Email).toBe("string");
  expect(lead.Email).toMatch(/@/);
});

test("Update Lead Company and validate", async () => {
  const result = await leadPage.createFakeLead();
  const newCompany = "Updated Company " + Date.now();
  await leadPage.updateLead(result.id, { Company: newCompany });
  const updated = await leadPage.getLeadById(result.id);
  expect(updated.Company).toBe(newCompany);
});

test("Delete Lead and confirm deletion", async () => {
  const result = await leadPage.createFakeLead();
  await leadPage.deleteLead(result.id);
  const deleted = await leadPage.getLeadById(result.id);
  expect(deleted).toBeUndefined();
});

test("Describe Lead SObject", async () => {
  const meta = await leadPage.describeLead();
  expect(meta.name).toBe("Lead");
  expect(Array.isArray(meta.fields)).toBe(true);
});

test("Bulk create Leads", async () => {
  const leads = Array.from({ length: 3 }).map(() => ({
    LastName: faker.person.lastName(),
    Company: faker.company.name(),
    Email: faker.internet.email(),
  }));
  const results = await leadPage.bulkCreateLeads(leads);
  expect(results.length).toBe(3);
  results.forEach((r) => expect(r.success).toBe(true));
});

test("SOQL Query for Leads", async () => {
  const records = await leadPage.soqlQuery(
    "SELECT Id, LastName FROM Lead LIMIT 5"
  );
  expect(records.records.length).toBeLessThanOrEqual(5);
});
