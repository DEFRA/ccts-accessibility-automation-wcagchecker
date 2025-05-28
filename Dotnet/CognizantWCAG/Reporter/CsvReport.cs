namespace Reports.Html.Reporter
{
    using Reports.Html.Utilities;
    using System.Text;
    using System.Web;

    public class CsvReport
    {
        public static void Generate()
        {
            var reportsPath = Path.Combine(Start.ReportsDir, "Accessibility_Report_" + DateTime.Now.ToString("dd-MM-yyyy-hh-mm-ss") + ".csv");
            var data = new Deserializer().DeserializeResults();

            // var columnsInReportWave = "Order,Component,Page URL,Title,Summary,Purpose,Actions,ElementXPath,Guideline Code,Guideline Link,Guideline Level,Browser,Category";
            var columnsInReport = "Page URL,Title,Summary,Purpose/Help,Actions/To Solve,Element XPath/Html,Guideline Code,Guideline Link/Help URL,Guideline Level/Tags,Browser,Category/Impact,Tool";
            //int order = 1;

            // Create/Open a file to write to.
            using (var sw = File.CreateText(reportsPath))
            {
                // Define columns
                sw.WriteLine(columnsInReport);

                // Fill worksheet with the data
                foreach (var result in data)
                {
                    //var component = CommonUtilities.GetComponentName(result.URL);

                    if (result.GuideLines == null || result.GuideLines.Count == 0)
                    {
                        var prepareLine = new StringBuilder();
                        //prepareLine.Append('"' + component + '"' + ',');
                        prepareLine.Append('"' + result.URL + '"' + ',');
                        prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Title) + '"' + ',');
                        prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Summary) + '"' + ',');
                        prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Purpose) + '"' + ',');
                        prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Actions.Replace(",", " ")) + '"' + ',');
                        prepareLine.Append('"' + HttpUtility.HtmlDecode(result.ElementXPath) + '"' + ',');
                        prepareLine.Append('"' + " " + '"' + ',');
                        prepareLine.Append('"' + " " + '"' + ',');
                        prepareLine.Append('"' + " " + '"' + ',');
                        prepareLine.Append('"' + result.Browser + '"' + ',');
                        prepareLine.Append('"' + result.Type + '"'+ ',');
                        prepareLine.Append('"' + result.Tool + '"');
                        prepareLine = prepareLine.Replace("\r\n", string.Empty);
                        prepareLine = prepareLine.Replace("\n", string.Empty);
                        sw.WriteLine(prepareLine.ToString());
                    }
                    else
                    {
                        foreach (var guildLine in result.GuideLines)
                        {
                            var prepareLine = new StringBuilder();
                            //prepareLine.Append('"' + component + '"' + ',');
                            prepareLine.Append('"' + result.URL + '"' + ',');
                            prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Title) + '"' + ',');
                            prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Summary) + '"' + ',');
                            prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Purpose) + '"' + ',');
                            prepareLine.Append('"' + HttpUtility.HtmlDecode(result.Actions.Replace(",", " ")) + '"' + ',');
                            prepareLine.Append('"' + HttpUtility.HtmlDecode(result.ElementXPath) + '"' + ',');
                            prepareLine.Append('"' + guildLine.GuidelineCode + '"' + ',');
                            prepareLine.Append('"' + guildLine.GuidelineLink + '"' + ',');
                            prepareLine.Append('"' + guildLine.GuidelineLevel + '"' + ',');
                            prepareLine.Append('"' + result.Browser + '"' + ',');
                            prepareLine.Append('"' + result.Type + '"'+ ',');
                            prepareLine.Append('"' + result.Tool + '"');
                            prepareLine = prepareLine.Replace("\r\n", string.Empty);
                            prepareLine = prepareLine.Replace("\n", string.Empty);
                            sw.WriteLine(prepareLine.ToString());
                        }
                    }
                }
            }
        }
    }
}
