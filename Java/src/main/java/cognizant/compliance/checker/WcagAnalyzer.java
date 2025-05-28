package cognizant.compliance.checker;

import java.io.IOException;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import cognizant.compliance.checker.contracts.WcagReport;
import cognizant.compliance.checker.contracts.WcagStatistics;
import cognizant.compliance.checker.contracts.WcagViolations;

public class WcagAnalyzer {

	public static String waveScript = "";
	public static String axeScript = "";

	public void init() throws IOException {
		WcagReport.StartDateTime = CommonUtils.getCurrentTimeStamp();
		waveScript = getAccessibilityScripts("wave.min.js");
		axeScript = getAccessibilityScripts("axe.min.js");
	}

	public void analyse(WebDriver driver, String pageKey) {

		String pageUniqueKey = pageKey.trim();
		String visitedUrl = driver.getCurrentUrl();
		String visitedPage = pageUniqueKey.length() > 0 ? visitedUrl.concat(pageUniqueKey) : visitedUrl;

		if (!WcagReport.VisitedPageUrls.containsKey(visitedPage)) {

			WcagReport.VisitedPageUrls.put(visitedPage, driver.getTitle());

			JavascriptExecutor jse = (JavascriptExecutor) driver;

			jse.executeScript(waveScript);

			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}

			collectWaveViolations(jse, visitedUrl);
			clearAllIcons(jse);

			jse.executeScript(axeScript);
			collectAxeViolations(jse, visitedUrl);
		}
	}

	public void analyse(WebDriver driver) {

		String visitedUrl = driver.getCurrentUrl();

		if (!WcagReport.VisitedPageUrls.containsKey(visitedUrl)) {

			WcagReport.VisitedPageUrls.put(visitedUrl, driver.getTitle());

			JavascriptExecutor jse = (JavascriptExecutor) driver;
			jse.executeScript(waveScript);

			try {
				Thread.sleep(1000);

				collectWaveViolations(jse, visitedUrl);
				clearAllIcons(jse);

				jse.executeScript(axeScript);
				collectAxeViolations(jse, visitedUrl);

			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}

	private void collectWaveViolations(JavascriptExecutor jse, String visitedUrl) {

		String jsonReport = (String) jse.executeScript("return JSON.stringify(window.violations());");
		String jsonStatistics = (String) jse.executeScript("return JSON.stringify(window.statistics());");

		WcagStatistics stats = WcagResultsProcessor.deserializeStatistic(jsonStatistics);
		WcagViolations violations = WcagResultsProcessor.deserializeWaveResults(jsonReport, visitedUrl);

		WcagReport.WaveViolations.putIfAbsent(visitedUrl, violations);
		WcagReport.WaveStatistics.putIfAbsent(visitedUrl, stats);
	}

	private void collectAxeViolations(JavascriptExecutor jse, String visitedUrl) {
		String axeViolations = (String) jse.executeAsyncScript(
				"var callback = arguments[arguments.length - 1]; axe.run().then(results => callback(JSON.stringify(results)));");

		WcagViolations violations = WcagResultsProcessor.deserializeAxeResults(axeViolations, visitedUrl);

		WcagReport.AxeViolations.putIfAbsent(visitedUrl, violations);
	}

	public void clearAllIcons(JavascriptExecutor js) {
		js.executeScript("window.hideAllIcons();");

		String removeScript = "var nodes = document.getElementsByTagName(\"accxtn\");\r\n\r\nfor (var i = 0, len = nodes.length; i != len; ++i) {\r\n    nodes[0].parentNode.removeChild(nodes[0]);\r\n}"
				+ "var nodes = document.getElementsByClassName(\"wave5icon\");\r\n\r\nfor (var i = 0, len = nodes.length; i != len; ++i) {\r\n    nodes[0].parentNode.removeChild(nodes[0]);\r\n}"
				+ "var element = document.getElementById(\"wave_sidebar_container\");\r\nelement.parentNode.removeChild(element);\r\n"
				+ "var element = document.getElementById(\"wave5topbar\");\r\nelement.parentNode.removeChild(element);\r\n"
				+ "var element = document.getElementById(\"wave5bottombar\");\r\nelement.parentNode.removeChild(element);\r\n"
				+ "var element = document.getElementById(\"wave5_iconbox\");\r\nelement.parentNode.removeChild(element);\r\n";

		js.executeScript(removeScript);
	}

	public String getAccessibilityScripts(String fileName) {
		return ResourceReader.readResourceFile(fileName);
	}
}