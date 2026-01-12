# E2E and API testing using Github Rest Api and Playwright
## Overview
Playwright framework demonstrating E2E, API, and visual testing
using modern automation practices. 
The framework follows a layered architecture that separates test logic, page interactions, utilities, and configuration.
Framework capabilities are built using a public API like GitHub's REST API.

This project is intentionally designed to resemble a real production automation framework rather than a minimal example, highlighting maintainability, scalability, and CI readiness.

## Tech Stack
- Playwright
- TypeScript
- Node.js
- GitHub Actions
- Allure reporting

## Features
- Page Object Model
- API + UI hybrid testing
- Storage state - Reusing authenticated state 
- CI integration
- Parallel execution
- Allure and HTML reports

## How to run tests:
### Local execution & Reporting
In a terminal run the following commands:
1. Clone the repository locally: 
```bash 
$ git clone <path>
```
2. Move to the repository folder and install dependencies: 
```bash
   $ cd <path_to_repo>
   $ npm install
   $ npx playwright install
```

4. In config folder, edit **.env** file with environment variables:
```bash
# Github repo details - for example: ‘https://github.com/microsoft/vscode` - owner is ‘microsoft’ and repo_name is ‘vscode’. Github_token is the token generated from https://github.com/settings/personal-access-tokens for the selected repo 
TOKEN = '<github access token>'
REPO_OWNER = '<github repository owner>'
REPO_NAME = '<github repository name>'
# Github user details - represents the user with which issues will be created
USERNAME = '<github username>'
PASSWORD = '<github password>'
```
3. Execute desired suite defined in package.json scripts:
```bash
// run all API tests
$ npm run tests:api 

// run all E2E tests
$ npm run tests:e2e 
```
Allure report is set as default reporter. After tests are run we can use the following command to generate and open the report:
```bash
// Make sure you have allure installed on your computer
$ brew install allure

// Run report generation and open report
$ npx allure generate allure-results --clean -o allure-report
$ npx allure open allure-report
```

### CI & Reporting
Tests are automatically executed on every push and pull request using GitHub Actions.
The CI pipeline:
 - Installs dependencies
 - Runs tests
 - Generates test reports
- Uploads artifacts for review

🔗 [Live Allure Report](https://florentinaciuciu.github.io/github-playwright-framework/)

### Docker
To make sure tests are run under same environment configuration a Docker file was added. To run the tests in a docker container follow these steps:
```bash
// Make sure you have docker installed on your computer
$ brew install docker
$ brew install docker-buildx
// Install docker desktop app from https://www.docker.com/products/docker-desktop/
// Build docker image, based on Dockerfile: 
$ docker buildx build -t playwright_docker .
// Run tests 		
$ docker run -it playwright_docker:latest
$ npm run tests:api
```

## Framework structure:
- **config**: folder for environment variables and other configuration files
- **setup**: folder for custom fixtures and setup script - these are used for all tests prerequisites
- **libs**: framework page objects and apis endpoint mappings
- **test-data**: folder for test data files like API schema validation files, data used in tests, text resources
- **tests**: folder containing all framework tests; organized based on the test category: API, UI E2E or Visual tests

In **playwright.config.ts** there are 4 projects configured:
-  each runs it's specific set of tests using testMatch filtering
-  each has it's specific baseUrl and prerequisite('setup' project) based on what kind of tests are executed
- projects:     
    - **setup**: it is used only as a prerequisite for E2e tests: the github login is performed once per test suite execution and storage state is saved and reused for all tests
    - **e2e**: Chrome and Firefox project configuration for all UI E2E and Visual tests
    - **api**: project configuration for all API tests