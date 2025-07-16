import { FieldType } from '../types/fields.js';
import { sfFieldTypeMap } from '../constants/sfFieldTypeMap.js';
import { PlaywrightHelper } from '../helpers/playwrightHelper.js';

/**
 * Looks up the field type from the central map based on its UI label.
 * @param {string} label The UI label of the field.
 * @returns {FieldType | null} The field's type, or null if not found.
 */
function getFieldTypeByLabel(label) {
  const fieldMapping = sfFieldTypeMap.find((field) => field.label === label);

  if (!fieldMapping) {
    console.warn(`[SalesforcePageHelper] Field with label "${label}" not found in sfFieldTypeMap.`);
    return null;
  }
  return fieldMapping.fieldType;
}

export class SalesforcePageHelper {
  constructor(page) {
    this.page = page;
    this.playwrightHelper = new PlaywrightHelper(page);
  }

  async getToastMessage() {
    const toastLocator = '//span[contains(@class, "toastMessage")]';
    await this.playwrightHelper.waitForElementVisible(toastLocator);

    const isToastPresent = await this.playwrightHelper.checkIfElementExist(toastLocator);
    return isToastPresent
      ? await this.playwrightHelper.getAttributeOfTheElement(toastLocator, 'text')
      : `${ResultMessagePrefix.Error} no toast message captured`;
  }

  // These are example implementations. You will need to build out the logic for your specific component library.
  async sendValueToInput(label, value) {
    const labelX = '//label[text()="' + label + '"]';
    await this.playwrightHelper.verifyLocator(labelX, 10000);
    if (await this.playwrightHelper.checkIfElementExist(labelX)) {
      const inputX = labelX + '/following::input[1]';
      await this.playwrightHelper.verifyLocator(inputX, 10000);
      if (await this.playwrightHelper.checkIfElementExist(inputX)) {
        await this.playwrightHelper.sendValue(inputX, value);
      }
    }
  }

  async setValueToPicklist(fieldLabel, value) {
    console.log(`[SalesforcePageHelper] Setting picklist "${fieldLabel}" to "${value}"`);
    // Example: await this.page.getByLabel(fieldLabel).click();
    // await this.page.getByRole('option', { name: value }).click();
  }

  async populateTestData(fieldLabel, value) {
    const fieldType = getFieldTypeByLabel(fieldLabel);

    switch (fieldType) {
      case FieldType.Input:
        await this.sendValueToInput(fieldLabel, value);
        break;
      case FieldType.Picklist:
        await this.setValueToPicklist(fieldLabel, value);
        break;
      default:
        console.warn(
          `[SalesforcePageHelper] The field type "${fieldType}" for label "${fieldLabel}" is not handled.`
        );
        break;
    }
  }
}
