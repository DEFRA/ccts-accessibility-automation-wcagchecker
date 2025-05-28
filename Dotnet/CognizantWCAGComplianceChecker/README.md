
This Solution is exposed with open source functions which Analyzes a given web page based on WCAG 2 guideline and produces the reports

Name : Cognizant.WCAG.Compliance.Checker
Namespaces available here are: 
Cognizant.WCAG.Compliance.Checker
Cognizant.WCAG.Compliance.Checker.Contract
Cognizant.WCAG.Compliance.Checker.Reporter
Cognizant.WCAG.Compliance.Checker.Utilities

Report types: There are 4 types of reporting options provided herewith. Consuming project can generate a CSV Report, Excel Report or as HTML report (By guideline or by Issue category)


Various end points exposed are as follows:

1.	In case, the consuming projects require to relax csp in their agent where test is running to allow the extension, can invoke the following method before create webdriver instance. This will add the extension to the chrome option and also allow the csp disabling extension.
Cognizant.WCAG.Compliance.Checker.Start.UpdateChromeOptions(ref chromeOptions);

2.	In the consuming project, once web driver is initialized, the following call must be made so as to have the extension setup initialized
       	Cognizant.WCAG.Compliance.Checker.Start.Initialize(CoreCustomContexts.BrowserDriver, <executionPath>, <ReportsPath>, <NeedScreenshots>);

3.	In the consuming project, the following call could be made wherever the page needs to be analyzed for results. For example, on each page load
Cognizant.WCAG.Compliance.Checker.Analyzer.Execute(driver);

4.	In the consuming project, any of the following calls could be made when report needs to be generated. For example, in the After scenario hook.
•	Cognizant.WCAG.Compliance.Checker.Reporter.CsvReport.Generate();
•	Cognizant.WCAG.Compliance.Checker.Reporter.ExcelReport.Generate();
•	Cognizant.WCAG.Compliance.Checker.Reporter.HtmlReport.GenerateByGuideline();
•	Cognizant.WCAG.Compliance.Checker.Reporter.HtmlReport.GenerateByCategory();


