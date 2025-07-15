const jsforce = require('jsforce');
const { faker } = require('@faker-js/faker');
const { expect } = require('@playwright/test');

class SalesforceLeadPage {
  constructor(loginUrl, username, password) {
    this.conn = new jsforce.Connection({ loginUrl });
    this.username = username;
    this.password = password;
  }

  async login() {
    await this.conn.login(this.username, this.password);
  }

  async createFakeLead() {
    const lead = {
      LastName: faker.person.lastName(),
      Company: faker.company.name(),
      Email: faker.internet.email(),
    };
    return await this.conn.sobject('Lead').create(lead);
  }

  async getLeadById(id) {
    const records = await this.conn
      .sobject('Lead')
      .find({ Id: id }, { Id: 1, LastName: 1, Company: 1, Email: 1 })
      .limit(1);
    return records[0];
  }

  async updateLead(id, fields) {
    return await this.conn.sobject('Lead').update({ Id: id, ...fields });
  }

  async deleteLead(id) {
    return await this.conn.sobject('Lead').destroy(id);
  }

  async convertLead(leadConvert) {
    // Use SOAP API for lead conversion, which expects an array of LeadConvert objects
    const results = await this.conn.soap.convertLead([leadConvert]);
    return results[0];
  }

  async describeLead() {
    return await this.conn.sobject('Lead').describe();
  }

  async bulkCreateLeads(leads) {
    return await this.conn.sobject('Lead').create(leads);
  }

  async soqlQuery(query) {
    return await this.conn.query(query);
  }

  async logout() {
    await this.conn.logout();
  }

  async navigateToLeadsPage(page) {
    await page.getByRole('button', { name: 'App Launcher' }).click();
    await expect(page.getByRole('combobox', { name: 'Search apps and items...' })).toBeVisible();
    await page.getByRole('combobox', { name: 'Search apps and items...' }).click();
    await page.getByRole('combobox', { name: 'Search apps and items...' }).fill('sales');
    await expect(page.getByRole('option', { name: 'Sales', exact: true })).toBeVisible();
    await page.getByRole('option', { name: 'Sales', exact: true }).click();
    await expect(page.getByRole('link', { name: 'Leads' })).toBeVisible();
    await page.getByRole('link', { name: 'Leads' }).click();
    await expect(page.getByRole('button', { name: 'New' })).toBeVisible();
    await page.getByRole('button', { name: 'New' }).click();
  }
}

module.exports = { SalesforceLeadPage };
