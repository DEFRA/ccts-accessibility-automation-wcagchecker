# WCAG Checker Implementation

The implementation of accessibility testing using Wave, Axe. Below are the steps to set up and utilize the WCAG Checker for Java automated regression test scripts:

## Prerequisites

Ensure you have the following dependencies installed:
- Selenium
- Java
- Maven
 
## Usage
This wrapper is used along with existing Selenium Automated regression pack.

### 1. Initialize Accessibility Checker
Use the `init()` method to initialize the accessibility checker. This method should be placed in hooks, such as the `BeforeAll`hook, to ensure it called before executing all tests.

```Java
new WcagAnalyzer().init();
```

### 2. Analyze the Page for Accessibility Issues
Use the `analyse(driver)` method to scan the current page for accessibility issues. This method should be called wherever you need to scan a page. This method takes 2 parameters, the browser instance as first parameter and followed by unique code(needed only when scan the same page multipe times, leave it otherwise).

```Java

new cognizant.compliance.checker.WcagAnalyzer().analyse(driver);

new cognizant.compliance.checker.WcagAnalyzer().analyse(driver, "unique key to differentiage each page scan");

```
### 3. Generate HTML Report by Category
Use the `getHtmlString()` method from `HtmlReportByIssueCategory` class to generate an HTML report categorized by accessibility violations. This method should be used in hooks, such as `@AfterAll` annotation, to produce the report after all test executions are completed.

```Java

FileWriter htmlByCategory = new FileWriter("Accessibility-Test-Result-By-Category.html");
htmlByCategory.write(new HtmlReportByIssueCategory().getHtmlString());
htmlByCategory.close();

```
## Example Workflow
Below is an example workflow for integrating the WCAG Checker:

1. Place `init()` in a hook like `@BeforeAll` annotation to initialize the accessibility checker.
2. Use `analyse(driver)` or `analyse(driver,"unique key")` in the specific test cases or hooks where a page scan is required.
3. After all tests, call `getHtmlString()` from `HtmlReportByIssueCategory` class  to generate and retrieve the accessibility report.

## Notes
- Ensure that the Axe and Selenium dependencies are properly configured in your project.
- The `getHtmlString()` method from `HtmlReportByGuidLines` class is available for generating reports categorized by WCAG guidelines.
- The `getJsonReport()` method from `JsonReport` class is also available for generating reports in json format.
