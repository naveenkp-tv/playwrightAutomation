import { RecordPage } from '../pages/recordPage.js';
import { PlaywrightHelper } from '../helpers/playwrightHelper.js';
import { SalesforcePageHelper } from '../helpers/salesforcePageHelper.js';

export class RecordController {
  constructor(page) {
    this.page = page;
    this.recordData = {};
    this.recordPage = new RecordPage(page);
    this.playwrightHelper = new PlaywrightHelper(page);
    this.salesforcePageHelper = new SalesforcePageHelper(page);
    this.saveButton = this.page.getByRole('button', { name: 'Save', exact: true });
    this.markAsStatusCompletedButton = this.page
      .locator('button')
      .filter({ hasText: 'Mark Status as Complete' });
  }

  async createRecord() {
    const toastLocator = '//span[contains(@class, "toastMessage")]';
    await this.recordPage.playwrightHelper.waitUntilElemenExists(this.saveButton);
    await this.recordPage.enterRecordData(this.recordData);
    await this.saveButton.click();
    await this.playwrightHelper.waitUntilElementNotExists(toastLocator, 30000);
    const toastMessage = await this.salesforcePageHelper.getToastMessage();

    await this.playwrightHelper.waitUntilElementNotExists(toastLocator);
    return toastMessage;
  }
}
