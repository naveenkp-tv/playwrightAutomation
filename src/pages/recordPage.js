const { PlaywrightHelper } = require('../helpers/playwrightHelper.js');
const { SalesforcePageHelper } = require('../helpers/salesforcePageHelper.js');

class RecordPage {
  page;
  salesforcePageHelper;
  playwrightHelper;
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

module.exports = { RecordPage };