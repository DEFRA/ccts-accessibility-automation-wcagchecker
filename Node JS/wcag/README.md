# WCAG Checker Implementation

The implementation of accessibility testing using Wave, Axe. Below are the steps to set up and utilize the WCAG Checker in NodeJs/Javascript applications:

## Prerequisites

Ensure you have the following dependencies installed:
- [Axe](https://www.deque.com/axe/)
- [WebDriverIO](https://webdriver.io/)
 
## Importing Required Methods

Import the following methods from `wcagchecker.js`:

```javascript
import { init, analyse, getHtmlReportByCategory, getHtmlReportByGuideLine, getJsonReport, getDateString } from 'wcagchecker.js';
```
## Usage

### 1. Initialize Accessibility Checker
Use the `init()` method to initialize the accessibility checker. This method should be placed in hooks, such as the `beforeAll` or `before` hook, to ensure it runs before executing all tests.

```javascript
await init();
```

### 2. Analyze the Page for Accessibility Issues
Use the `analyse()` method to scan the current page for accessibility issues. This method should be called wherever you need to scan a page. This method takes 2 parameters, the browser instance as first parameter and followed by unique code(needed only when scan the same page multipe times, leave blank otherwise).

```javascript

await analyse(browser, '');

```
### 3. Generate HTML Report by Category
Use the `getHtmlReportByCategory()` method to generate an HTML report categorized by accessibility violations. This method should be used in hooks, such as `afterAll` or `after`, to capture the report after all test executions are completed.

```javascript

await getHtmlReportByCategory();

```
## Example Workflow
Below is an example workflow for integrating the WCAG Checker:

1. Place `await init()` in a hook like `beforeAll` to initialize the accessibility checker.
2. Use `await analyse(browser, '')` in the specific test cases or hooks where a page scan is required.
3. After all tests, call `await getHtmlReportByCategory()` to generate and retrieve the accessibility report.

## Notes
- Ensure that the Axe and WebDriverIO dependencies are properly configured in your project.
- The `getHtmlReportByGuideLine` method is available for generating reports categorized by WCAG guidelines.
- The `getJsonReport` method is also available for generating reports in json format.
