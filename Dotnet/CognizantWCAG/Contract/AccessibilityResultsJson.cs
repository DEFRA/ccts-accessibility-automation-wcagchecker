using Selenium.Axe;

namespace Reports.Html.Contract
{
    public class AccessibilityResultsJson
    {
        public static Dictionary<string, string> JsonReports = new();
        public static Dictionary<string, string> JsonStatistics = new();
        public static Dictionary<string, string> PageScreenshots = new();
        public static Dictionary<string, AxeResult> AxeResults = new Dictionary<string, AxeResult>();
    }
}
