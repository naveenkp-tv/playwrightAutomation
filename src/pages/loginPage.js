require('dotenv').config();
const { PlaywrightHelper } = require('../helpers/playwrightHelper');

class LoginPage {
  page;
  url;
  username;
  playwrightHelper;
  constructor(page) {
    this.page = page;
    this.playwrightHelper = new PlaywrightHelper(this.page);

    // Login Locators
    this.userNameInput = this.page.getByLabel("Username");
    this.passwordInput = this.page.getByLabel("Password");
    this.loginButton = this.page.getByRole("button", {
      name: "Log In",
      exact: true
    });
  }

  async loginMain(url, username, password) {
    await this.page.goto(url);
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL("**/lightning/**");
    await this.playwrightHelper.waitUntilHTMLIsRendered();
  }

}

module.exports = { LoginPage };
