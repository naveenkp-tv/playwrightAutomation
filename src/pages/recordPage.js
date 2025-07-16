import { PlaywrightHelper } from '../helpers/playwrightHelper.js';
import { SalesforcePageHelper } from '../helpers/salesforcePageHelper.js';

export class RecordPage {
  constructor(page) {
    this.page = page;
    this.playwrightHelper = new PlaywrightHelper(page);
    this.salesforcePageHelper = new SalesforcePageHelper(page);
  }

  async enterRecordData(recordData) {
    for (const [fieldLabel, value] of Object.entries(recordData)) {
      await this.salesforcePageHelper.populateTestData(fieldLabel, value.toString());
    }
  }
}
