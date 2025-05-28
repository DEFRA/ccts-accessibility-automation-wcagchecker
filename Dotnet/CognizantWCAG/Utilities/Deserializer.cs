using Reports.Html.Contract;
using Newtonsoft.Json.Linq;
using System.Text;
using System.Web;
using DocumentFormat.OpenXml.Presentation;

namespace Reports.Html.Utilities
{
    internal class Deserializer
    {
        public AccessibilityStatistics DeserializeStatistics()
        {
            var statsData = new AccessibilityStatistics();

            foreach (var item in AccessibilityResultsJson.JsonStatistics)
            {
                var jsonStat = JObject.Parse(item.Value);
                var stat = new AccessibilityStatistic
                {
                    AllItemCount = jsonStat.SelectToken("allitemcount").ToString(),
                    TotalElements = jsonStat.SelectToken("totalelements").ToString(),
                    PageTitle = jsonStat.SelectToken("pagetitle").ToString(),
                    Error = jsonStat.SelectToken("error").ToString(),
                    Contrast = jsonStat.SelectToken("contrast").ToString(),
                    Alert = jsonStat.SelectToken("alert").ToString(),
                    URL = item.Key,
                };
                statsData.Add(stat);
            }
            return statsData;
        }

        public void DeserializeAxeResults(ref AccessibilityResults resultsData)
        {
            foreach (var currentItem in AccessibilityResultsJson.AxeResults)
            {
                for (int i = 0; i < currentItem.Value.Violations.Length; i++)
                {
                    var rowValue = currentItem.Value.Violations[i];
                    foreach (var item in rowValue.Nodes)
                    {
                        StringBuilder toSolveValue = new StringBuilder();
                        StringBuilder tags = new StringBuilder();

                        // concatenate tags
                        foreach (string tag in rowValue.Tags)
                        {
                            tags.Append(", " + tag);
                        }

                        if (tags != null && tags.Length > 2)
                        {
                            tags.Remove(0, 2); // remove comma at the beginning
                        }

                        // concatenate tosolve messages
                        var allCheckResults = item.All;
                        foreach (var checkResult in allCheckResults)
                        {
                            toSolveValue.Append(", " + HttpUtility.HtmlDecode(checkResult.Message));
                        }

                        if (toSolveValue != null && toSolveValue.Length > 2)
                        {
                            toSolveValue.Remove(0, 2); // remove comma at the beginning
                        }

                        //string htmlValue = HttpUtility.HtmlDecode(item.Html).TrimEnd();
                        string htmlValue = HttpUtility.HtmlEncode(item.Html).TrimEnd();
                        htmlValue = htmlValue.Replace("\r\n", string.Empty);
                        htmlValue = htmlValue.Replace("\n", string.Empty);
                        htmlValue = htmlValue.Replace("  ", string.Empty);

                        var result = new AccessibilityResult
                        {
                            URL = currentItem.Value.Url,
                            Title = rowValue.Id,
                            Summary = rowValue.Description,
                            Purpose = rowValue.Help,
                            Actions = toSolveValue.ToString().Trim().Replace("\r\n", string.Empty),
                            ElementXPath = htmlValue,
                            Browser = "CHROME",
                            Type = rowValue.Impact,
                            Tool = "Axe",
                            GuideLines = new List<GuideLine>()
                        };


                        result.GuideLines.Add(new GuideLine
                        {
                            Name = "Axe Violation",
                            GuidelineCode = "",
                            GuidelineLink = rowValue.HelpUrl,
                            GuidelineLevel = tags.ToString().Trim().Replace("\r\n", string.Empty)
                        });
                        resultsData.Add(result);
                    }
                }
            }
        }

        public AccessibilityResults DeserializeResults()
        {
            var resultsData = new AccessibilityResults();
            int order = 1;
            int pageCount = 1;

            foreach (var item in AccessibilityResultsJson.JsonReports)
            {
                var jsonReport = JObject.Parse(item.Value);

                foreach (var report in jsonReport) // foreach category
                {
                    if (report.Key == "feature" || report.Key == "structure" || report.Key == "aria")
                    {
                        continue;
                    }

                    foreach (var violation in report.Value) // for each violation
                    {
                        var result = new AccessibilityResult
                        {
                            URL = item.Key,
                            // Order = order.ToString(),
                            Title = violation.SelectToken("data.title").ToString().Trim().Replace("\r\n", string.Empty),
                            Summary = violation.SelectToken("data.summary").ToString().Trim().Replace("\r\n", string.Empty),
                            Purpose = HttpUtility.HtmlDecode(violation.SelectToken("data.purpose").ToString()).Trim().Replace("\r\n", string.Empty),
                            Actions = HttpUtility.HtmlDecode(violation.SelectToken("data.actions").ToString()).Trim().Replace("\r\n", string.Empty),
                            ElementXPath = violation.SelectToken("itemXPath").ToString(),
                            Browser = "CHROME",
                            Type = violation.SelectToken("data.cat_code").ToString(),
                            Tool = "Cognizant WCAG Compliance Checker"
                        };

                        if (violation.SelectToken("data.guidelines").Count() > 0)
                        {
                            var jsonGuideLines = JObject.Parse(violation.SelectToken("data.guidelines").ToString());

                            var guidLines = new List<GuideLine>();

                            foreach (var guideLine in jsonGuideLines) // for each violation
                            {
                                guidLines.Add(new GuideLine
                                {
                                    Name = guideLine.Value.SelectToken("name").ToString(),
                                    GuidelineCode = guideLine.Value.SelectToken("code").ToString(),
                                    GuidelineLink = guideLine.Value.SelectToken("link").ToString(),
                                    GuidelineLevel = guideLine.Value.SelectToken("level_name").ToString()
                                });
                            }

                            result.GuideLines = guidLines;
                        }

                        resultsData.Add(result);
                        //order++;
                    }
                }
                pageCount++;
            }

            DeserializeAxeResults(ref resultsData);

            return resultsData;
        }
    }
}
