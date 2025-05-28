using OpenQA.Selenium;

namespace Cognizant.WCAG.Compliance.Checker
{
    public class Start
    {
        public static void Init(IWebDriver driver, string reportPath, bool isHardDownload)
        {
            Reports.Html.Start.Init(driver, reportPath, isHardDownload);
        }
    }
}