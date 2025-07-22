# Playwright Salesforce Lead Automation

This project demonstrates how to automate Salesforce Lead creation and validation using Playwright, jsforce, and the Page Object Model (POM) pattern. Test data is generated using faker.js, and credentials are securely managed with a `.env` file.

## Prerequisites

- Node.js (v16 or above recommended)
- npm (comes with Node.js)
- Access to a Salesforce Developer Org

## Setup Steps

### 1. Clone the Repository
```bash
git clone https://github.com/naveenkp-tv/playwrightAutomation.git
cd playwrightAutomation
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root with the following content (no quotes, no spaces after `=`):

```
SF_LOGIN_URL=https://login.salesforce.com
SF_USERNAME=your-salesforce-username
SF_PASSWORD=your-salesforce-password
SF_API_PASSWORD=your-salesforce-password-or-password+securitytoken
```

- `SF_LOGIN_URL`: The Salesforce login URL (e.g., `https://login.salesforce.com` or your custom domain).
- `SF_USERNAME`: Your Salesforce username (email address).
- `SF_PASSWORD`: Your Salesforce password (for UI login).
- `SF_API_PASSWORD`: Your Salesforce password **plus security token** if required (for API login). For example, if your password is `mypassword` and your security token is `XYZ`, set `SF_API_PASSWORD=mypasswordXYZ`.

> **Note:** If your Salesforce org requires a security token for API access, append it to your password in `SF_API_PASSWORD`.
> 
> **CI/CD:** In CI, set these as repository secrets and map them to environment variables in your workflow.

### 4. Run the Tests
```bash
npx playwright test
```

## Project Structure
```
playwrightAutomation/
├── pages/
│   └── SalesforceLeadPage.js   # Page Object for Salesforce Lead actions
├── tests/
│   └── salesforceApi.spec.js   # Main Playwright test
├── .env                       # Environment variables (not committed)
├── package.json
├── README.md
└── ...
```

## How It Works
- The test logs into Salesforce using credentials from `.env`.
- It creates a Lead with random data using faker.js.
- It validates the creation and queries the Lead to print its details.

## Useful npm Commands
- `npm install` – Install all dependencies
- `npx playwright test` – Run all Playwright tests
- `npx playwright test tests/salesforceApi.spec.js` – Run a specific test file

## Troubleshooting
- **TypeError: Only absolute URLs are supported**: Check your `.env` file for correct formatting (no spaces, no quotes, no semicolons).
- **LOGIN_MUST_USE_SECURITY_TOKEN**: If you get this error, append your Salesforce security token to your password in `SF_API_PASSWORD`.
- **400 Bad Request**: Usually caused by formatting issues in `.env`.

## Additional Notes
- Never commit your `.env` file with real credentials to version control.
- For more info on Playwright: https://playwright.dev/
- For more info on jsforce: https://jsforce.github.io/

---

Happy Testing!
