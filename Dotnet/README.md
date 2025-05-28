# Cognizant WCAG Compliance Checker

## Overview
This solution is exposed with open-source functions that analyze a given web page based on **WCAG 2** guidelines and generate reports.

## Name
**Cognizant.WCAG.Compliance.Checker**

## Available Namespaces
- `Cognizant.WCAG.Compliance.Checker`
- `Cognizant.WCAG.Compliance.Checker.Contract`
- `Cognizant.WCAG.Compliance.Checker.Reporter`
- `Cognizant.WCAG.Compliance.Checker.Utilities`

## Report Types
This solution provides four reporting options, allowing consuming projects to generate:
- **CSV Report**
- **Excel Report**
- **HTML Report (By guideline or by issue category)**

## Exposed Endpoints

### **Updating Chrome Options**
If consuming projects need to relax CSP in their agent where tests are running, they can invoke the following method before creating a WebDriver instance:

```csharp
Cognizant.WCAG.Compliance.Checker.Start.UpdateChromeOptions(ref chromeOptions);