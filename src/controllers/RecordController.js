const { RecordPage } = require('../pages/recordPage.js');

class RecordController {
    page;
  recordData;
  recordPage;

  constructor(page) {
    this.page = page;
    this.recordData = {};
    this.recordPage = new RecordPage(page);
    this.saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
    this.markAsStatusCompletedButton = this.page.locator('button').filter({ hasText: 'Mark Status as Complete' })
  }

  async createRecord() {
    await this.recordPage.playwrightHelper.waitUntilElemenExists(this.saveButton);
    await this.recordPage.enterRecordData(this.recordData);
    await this.saveButton.click();
    await this.recordPage.playwrightHelper.waitUntilElemenExists(this.markAsStatusCompletedButton, 20000 );
  }
}

module.exports = { RecordController };