class PlaywrightHelper {
  Page;
  constructor(page) {
    this.page = page;
  }

  async click(locator) {
    locator = this.getPageLocator(locator).first();
    await locator.click();
  }

  async forceClick(locator) {
    locator = this.getPageLocator(locator);
    await locator.click({ force: true });
  }

  async checkIfElementExist(locator, timeout) {
    timeout = timeout ?? 10000;
    locator = this.getPageLocator(locator);
    try {
      // Wait for the element to be present in the DOM
      await locator.first().waitFor({ timeout: timeout });
      return true; // Element exists
    } catch {
      return false; // Element does not exist or timeout
    }
  }

  async sendValue(locator, elementValue) {
    if (typeof locator === 'string') {
      locator = this.page.locator(locator);
    }
    await locator.waitFor();
    await locator.clear();
    await locator.focus();
    await locator.fill(elementValue);
  }

  async verifyLocator(locator, timeout) {
    locator = this.getPageLocator(locator);
    const exists = await this.checkIfElementExist(locator, timeout);

    if (!exists) {
      console.log(`Locator is NOT found, please check, Locator: ${locator} \n`);

      expect(exists).toBeTruthy();
    }
    return exists;
  }

  async wait(miliseconds) {
    await this.page.waitForTimeout(miliseconds);
  }

  getPageLocator(value) {
    return typeof value === 'string' ? this.page.locator(value) : value;
  }

  async waitUntilElemenExists(locator, timeout) {
    locator = this.getPageLocator(locator);
    timeout = timeout ?? 10000;
    await locator.waitFor({ state: 'attached', timeout: timeout });
  }

  async waitUntilDocumentLoaded() {
    await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
  }

  async waitUntilHTMLIsRendered(timeout, checkInterval, stabilityChecks) {
    timeout = timeout ?? 20000;
    checkInterval = checkInterval ?? 1000;
    stabilityChecks = stabilityChecks ?? 3;
    const maxChecks = Math.floor(timeout / checkInterval);
    let lastHTMLSize = 0;
    let stableCount = 0;

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < maxChecks; i++) {
      if (this.page.isClosed()) {
        // console.warn("Page was closed, stopping waitUntilHTMLIsRendered.");
        return;
      }

      try {
        // Ensure page is not navigating before evaluating
        await this.page.waitForLoadState('domcontentloaded');

        const currentHTMLSize = await this.page.evaluate(() => document.body.innerHTML.length);

        if (currentHTMLSize === lastHTMLSize) {
          stableCount++;
          if (stableCount >= stabilityChecks) return;
        } else {
          stableCount = 0;
        }

        lastHTMLSize = currentHTMLSize;
        await delay(checkInterval);
      } catch (error) {
        // console.warn("Evaluation failed due to possible navigation:", error);
        await this.page.waitForLoadState('domcontentloaded'); // Ensure page is stable before retrying
      }
    }

    throw new Error('Timeout waiting for HTML to stabilize');
  }

  async waitAndClick(locator) {
    await locator.waitFor();
    await locator.click();
  }

  async refreshPage() {
    await this.page.reload();
    await this.waitUntilHTMLIsRendered();
  }

  async reloadPage() {
    await this.page.reload();
    await this.waitUntilHTMLIsRendered();
  }
}

module.exports = { PlaywrightHelper };
