# WAVE Accessibility Automation

## Overview
The following repo contains dependencies for accessibility automation

## Dependencies

1. Selenium 4

2. Java

3. Maven

4. WAVE Chrome Extension Download access from https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${version}&x=id%3Djbbplnpkjmmeebjpijfedlgcdilocofh%26installsource%3Dondemand%26uc&nacl_arch=x86-64&acceptformat=crx2,crx3


## How to use?

This middleware is used along with Selenium Test Automation regression pack.

1. Call the below method in Before Test Run:

```new AccessibilityTestExecutor().init(driver, "C:\\Users\\214101\\Downloads\\Temp", "", false);

2. Call the below method to the places whereever visiting to the page/URL:

```new AccessibilityTestExecutor().start(driver);

3. Call the below method to collect the accessibility issues at the end of test execution/TeadDown process:

```new HtmlReportByGuidLines().getHtmlString()

	FileWriter htmlWriter = new FileWriter("Wave-accessibility-result.html");
	htmlWriter.write(new HtmlReportByGuidLines().getHtmlString());
	htmlWriter.close();