using OpenQA.Selenium;

namespace Cognizant.WCAG.Compliance.Checker
{
    public class Analyzer
    {
        public static void Execute(IWebDriver driver, bool reAnalyzePage=false)
        {
            Reports.Html.Analyzer.Execute(driver, reAnalyzePage);
        }
    }
}
