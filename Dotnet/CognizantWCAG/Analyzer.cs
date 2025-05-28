using OpenQA.Selenium;
using Reports.Html.Contract;

namespace Reports.Html
{
    using DocumentFormat.OpenXml.Spreadsheet;
    using Selenium.Axe;
    public class Analyzer
    {
        private static bool replacePageResult = false;

        public static void Execute(IWebDriver driver, bool reAnalyzePage = false)
        {
            replacePageResult = reAnalyzePage;
            if (!replacePageResult && AccessibilityResultsJson.JsonReports != null && AccessibilityResultsJson.JsonReports.Count > 0 && AccessibilityResultsJson.JsonReports.ContainsKey(driver.Url))
            {
                return;
            }

            ExecuteJSScript(driver);
            ExecuteAxeApi(driver);
        }

        private static void ExecuteJSScript(IWebDriver driver)
        {
            try
            {
                if (!replacePageResult && AccessibilityResultsJson.JsonReports.ContainsKey(driver.Url))
                {
                    return;
                }

                driver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(300);

                ((IJavaScriptExecutor)driver).ExecuteScript(Start.JsRuleScript);

                CollectAccessibilityIssues(driver);
            }
            catch (Exception exception)
            {
                Console.Out.WriteLine($"AccessibilityLog: Error while ExecuteJSScript as follows: " + exception.Message);
                return;
            }
        }

        private static void CollectAccessibilityIssues(IWebDriver driver)
        {

            if (AccessibilityResultsJson.JsonReports.ContainsKey(driver.Url) && !replacePageResult)
            {
                return;
            }

            var javaScriptExecutor = (IJavaScriptExecutor)driver;

            try
            {
                var jsonReport = (string)javaScriptExecutor.ExecuteScript("return window.violations();");

                if (AccessibilityResultsJson.JsonReports.ContainsKey(driver.Url) && replacePageResult)
                {
                    AccessibilityResultsJson.JsonReports[driver.Url] = jsonReport;
                }
                else
                {
                    AccessibilityResultsJson.JsonReports.Add(driver.Url, jsonReport);
                }

                var jsonStatistics = (string)javaScriptExecutor.ExecuteScript("return window.statistics();");

                if (AccessibilityResultsJson.JsonStatistics.ContainsKey(driver.Url) && replacePageResult)
                {
                    AccessibilityResultsJson.JsonStatistics[driver.Url] = jsonStatistics;
                }
                else
                {
                    AccessibilityResultsJson.JsonStatistics.Add(driver.Url, jsonStatistics);
                }

                javaScriptExecutor.ExecuteScript("window.hideAllIcons();");

                RemoveScriptFromPage(javaScriptExecutor);
            }
            catch (Exception exception)
            {
                Console.Out.WriteLine($"AccessibilityLog: Error while CollectAccessibilityIssues: " + exception.Message);
            }
        }

        private static void RemoveScriptFromPage(IJavaScriptExecutor javaScriptExecutor)
        {
            try
            {
                var removeScript = "var nodes = document.getElementsByTagName(\"accxtn\");\r\n\r\nfor (var i = 0, len = nodes.length; i != len; ++i) {\r\n    nodes[0].parentNode.removeChild(nodes[0]);\r\n}" +
                    "var nodes = document.getElementsByClassName(\"wave5icon\");\r\n\r\nfor (var i = 0, len = nodes.length; i != len; ++i) {\r\n    nodes[0].parentNode.removeChild(nodes[0]);\r\n}" +
                    "var element = document.getElementById(\"wave_sidebar_container\");\r\nelement.parentNode.removeChild(element);\r\n" +
                    "var element = document.getElementById(\"wave5topbar\");\r\nelement.parentNode.removeChild(element);\r\n" +
                    "var element = document.getElementById(\"wave5bottombar\");\r\nelement.parentNode.removeChild(element);\r\n" +
                    "var element = document.getElementById(\"wave5_iconbox\");\r\nelement.parentNode.removeChild(element);\r\n";

                javaScriptExecutor.ExecuteScript(removeScript);

            }
            catch (Exception exception)
            {
                Console.Out.WriteLine($"AccessibilityLog: Error while RemoveScriptFromPage.ExecuteScript as follows: " + exception.Message);
            }
        }

        private static void ExecuteAxeApi(IWebDriver driver)
        {
            if (AccessibilityResultsJson.AxeResults.Keys.Contains(driver.Url))
            {
                return;
            }

            AxeResult result;
            try
            {
                result = new AxeBuilder(driver).Analyze();
                AccessibilityResultsJson.AxeResults.Add(driver.Url, result);
            }
            catch (Exception)
            {
                Console.Out.WriteLine($"Error while generating accessibility report for page: {driver.Url}. Skipping.");
                return;
            }
        }
    }
}