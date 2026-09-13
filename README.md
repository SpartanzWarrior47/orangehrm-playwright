# OrangeHRM Playwright Automation

## Project Overview

This project contains UI and API automation tests for the OrangeHRM application using Playwright with TypeScript.

The automation covers the **"employee lifecycle"**, including:

- Login
- Employee creation
- Profile picture upload
- Employee details validation
- Employee search
- Employee details update
- Job Title and Employment Status update
- API validation
- Employee deletion
- Logout
- Session invalidation

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Playwright Test
- Page Object Model (POM)
- JSON test data
- Playwright APIRequestContext
- HTML reporting

## Test Coverage

The automated test validates the following employee lifecycle:

1. Login to OrangeHRM
2. Navigate to the PIM module
3. Add a new employee
4. Upload a profile picture
5. Verify the employee details in the UI
6. Validate the created employee through the API
7. Search for the employee in the Employee List
8. Edit the employee
9. Update Job Title
10. Update Employment Status
11. Verify the updated details in the UI
12. Validate the updated details through the API
13. Delete the employee
14. Verify the employee is no longer available in the UI
15. Validate deletion through the API
16. Logout
17. Verify that the authenticated session is invalidated

## Framework Structure

```text

orangehrm-playwright/
├── assets/
│   └── warrior-cartoon.png
├── pages/
│   ├── AddEmployeePage.ts
│   ├── DashboardPage.ts
│   ├── EmployeeDetailsPage.ts
│   ├── EmployeeListPage.ts
│   ├── LoginPage.ts
│   └── PIMPage.ts
├── test-data/
│   └── employee.json
├── tests/
│   └── employee-lifecycle.spec.ts
├── utils/
│   └── apiHelper.ts
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
└── .gitignore
```

### Folder responsibilities

pages/ — Page Object classes containing locators and reusable page actions.
tests/ — Test specifications containing the employee lifecycle scenario.
test-data/ — External JSON test data used by the test.
utils/ — Reusable utilities, including API helper functionality.
assets/ — Test assets used during automation, such as the employee profile picture.
playwright.config.ts — Playwright configuration, browser projects, timeouts, reporting, video, and screenshots.

## Installation

Clone the repository and install the project dependencies:

```bash
npm install
```

Install the Playwright browsers: 

```bash
npx playwright install
```

## Running Tests

Run the complete test suite: 

```bash
npm test
```

Run tests with the browser visible:

```bash
npm run test:headed
```

Run a specific test file:

```bash
npx playwright test tests/employee-lifecycle.spec.ts
```

Open the HTML test report:

```bash
npm run report
```

## Browser Coverage

The test suite is configured to run against:

- Chromium
- Firefox
- WebKit

The lifecycle test is executed sequentially using a single worker because the test creates, updates, and deletes data in the shared OrangeHRM demo environment.

Cross-browser execution is included to provide additional browser coverage beyond the core assessment requirements.

## Test Configuration

The Playwright configuration includes:

- 60-second test timeout
- 60-second action timeout
- 60-second navigation timeout
- HTML reporter
- Video recording
- Screenshots on failure
- Trace collection on first retry
- Configured OrangeHRM base URL
- Single worker execution for reliable state-changing tests

## Test Data

Employee test data is maintained separately in `test-data/employee.json`.

The test uses the JSON data for:

- First Name
- Last Name
- Employee ID
- Profile Picture
- Job Title
- Employment Status

A unique Employee ID is generated at runtime by combining the configured employee ID with the current timestamp. This helps avoid conflicts when executing the test against the shared OrangeHRM demo environment.

## API Validation

The test uses Playwright's `APIRequestContext` to validate employee data through the OrangeHRM API.

API validation is performed after:

- Employee creation
- Employee details update
- Employee deletion

The API is used for backend verification, while the employee lifecycle actions are performed through the UI.

## Reporting

The project uses Playwright's built-in HTML reporter.

After test execution, the report can be opened using:

```bash
npm run report
```


The test configuration also captures:

Video recordings for test execution
Screenshots when a test fails
Trace information on the first retry

## Notes

- The automation targets the OrangeHRM public demo application.
- The test generates a unique Employee ID during execution to reduce conflicts with existing demo data.
- Browser coverage includes Chromium, Firefox, and WebKit.
- State-changing employee lifecycle operations are executed sequentially using a single worker.