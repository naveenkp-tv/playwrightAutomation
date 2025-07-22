import dotenv from 'dotenv';
dotenv.config();
import { test, expect } from '@playwright/test';
import { SalesforceLeadPage } from '../pages/SalesforceLeadPage.js';
import { faker } from '@faker-js/faker';

let leadPage;

test.beforeAll(async () => {
  leadPage = new SalesforceLeadPage(
    process.env.SF_LOGIN_URL,
    process.env.SF_USERNAME,
    process.env.SF_API_PASSWORD
  );
  await leadPage.login();
});

test.afterAll(async () => {
  if (leadPage) {
    await leadPage.logout();
  }
});

test.describe.serial('Lead API Tests', () => {
  test('Create Lead in Salesforce and validate recordId', async () => {
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
      Email: lead.Email,
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

  test('Update Lead Company and validate', async () => {
    const result = await leadPage.createFakeLead();
    const newCompany = 'Updated Company ' + Date.now();
    await leadPage.updateLead(result.id, { Company: newCompany });
    const updated = await leadPage.getLeadById(result.id);
    expect(updated.Company).toBe(newCompany);
  });

  test('Delete Lead and confirm deletion', async () => {
    const result = await leadPage.createFakeLead();
    await leadPage.deleteLead(result.id);
    const deleted = await leadPage.getLeadById(result.id);
    expect(deleted).toBeUndefined();
  });

  test('Describe Lead SObject', async () => {
    const meta = await leadPage.describeLead();
    expect(meta.name).toBe('Lead');
    expect(Array.isArray(meta.fields)).toBe(true);
  });

  test('Bulk create Leads', async () => {
    const leads = Array.from({ length: 3 }).map(() => ({
      LastName: faker.person.lastName(),
      Company: faker.company.name(),
      Email: faker.internet.email(),
    }));
    const results = await leadPage.bulkCreateLeads(leads);
    expect(results.length).toBe(3);
    results.forEach((r) => expect(r.success).toBe(true));
  });

  test('SOQL Query for Leads', async () => {
    const records = await leadPage.soqlQuery('SELECT Id, LastName FROM Lead LIMIT 5');
    expect(records.records.length).toBeLessThanOrEqual(5);
  });

  test('Convert Lead and verify Account, Contact, and Opportunity creation', async () => {
    // 1. Create a new lead
    const leadResult = await leadPage.createFakeLead();
    expect(leadResult.success).toBe(true);
    console.log('Created Lead for conversion:', leadResult.id);

    // 2. Convert the lead
    // Note: 'Closed - Converted' is a standard status. This may need to be adjusted
    // based on your Salesforce org's specific Lead Status picklist values for conversion.
    const conversionResult = await leadPage.convertLead({
      leadId: leadResult.id,
      convertedStatus: 'Closed - Converted',
    });
    expect(conversionResult.success).toBe(true);

    // 3. Verify the creation of Account, Contact, and Opportunity
    expect(conversionResult).toHaveProperty('accountId');
    expect(conversionResult).toHaveProperty('contactId');
    expect(conversionResult).toHaveProperty('opportunityId');

    // 4. Print the new record IDs
    console.log('Lead Converted Successfully:');
    console.log('  Account ID:', conversionResult.accountId);
    console.log('  Contact ID:', conversionResult.contactId);
    console.log('  Opportunity ID:', conversionResult.opportunityId);

    // 5. Assert that the IDs are valid Salesforce IDs
    expect(conversionResult.accountId).toMatch(/^001/); // Account ID prefix
    expect(conversionResult.contactId).toMatch(/^003/); // Contact ID prefix
    expect(conversionResult.opportunityId).toMatch(/^006/); // Opportunity ID prefix
  });
});
