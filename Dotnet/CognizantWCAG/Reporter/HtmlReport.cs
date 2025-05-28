using HtmlAgilityPack;
using System.Text;

namespace Reports.Html.Reporter
{
    
    public class HtmlReport
    {
        public static void GenerateByGuideline()
        {
            Start.TestExecutionEndedAt = DateTime.UtcNow.ToString("dd-MM-yyyy HH:mm:ss");
            var reportsPath = Path.Combine(Start.ReportsDir, "Accessibility_Report_By_Guideline_" + DateTime.Now.ToString("dd-MM-yyyy-hh-mm-ss") + ".html");
            var html = HtmlReportByGuideline.GetHtmlstring();
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            doc.Save(reportsPath, Encoding.UTF8);
        }

        public static void GenerateByCategory()
        {
            Start.TestExecutionEndedAt = DateTime.UtcNow.ToString("dd-MM-yyyy HH:mm:ss");
            var reportsPath = Path.Combine(Start.ReportsDir, "Accessibility_Report_By_Category_" + DateTime.Now.ToString("dd-MM-yyyy-hh-mm-ss") + ".html");
            var html = HtmlReportByCategory.GetHtmlstring();
            var doc = new HtmlDocument();
            doc.LoadHtml(html);
            doc.Save(reportsPath, Encoding.UTF8);
        }
    }
}
