using DocumentFormat.OpenXml.Bibliography;
using Reports.Html.Contract;
using Reports.Html.Utilities;
using System.Text;
using System.Web;

namespace Reports.Html.Reporter
{

    public class HtmlReportByCategory
    {
        private static int totalCriticalIssuesCount = 0;
        private static int totalMediumIssuesCount = 0;
        private static string htmlHeader = "<head>" + "	<title>Accessibility Test Run Report</title>"
            + "	<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css\">"
            + "	<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js\"></script><style>${statisticsStyles}</style>"
            + "</head>";

        private static string htmlTotalIssues = "<div class=\"row mb-3\">" + "			<div class=\"col-4\">"
                + "				<div class=\"card\">"
                + "					<div class=\"card-header h6 block-color text-white text-opacity-75\">"
                + "						Total Pages" + "					</div>"
                + "					<div class=\"card-body text-center h6\">" + "						${TotalPages}"
                + "					</div>" + "				</div>" + "			</div>" + "			<div class=\"col-4\">"
                + "				<div class=\"card\">"
                + "					<div class=\"card-header h6 bg-danger bg-gradient text-white text-opacity-75\">"
                + "						Critical Issues" + "					</div>"
                + "					<div class=\"card-body text-center h6\">"
                + "						${TotalCriticalIssues}" + "					</div>" + "				</div>"
                + "			</div>" + "			<div class=\"col-4\">" + "				<div class=\"card\">"
                + "					<div class=\"card-header h6 bg-warning text-white text-opacity-75\">"
                + "						Medium Issues" + "					</div>"
                + "					<div class=\"card-body text-center h6\">"
                + "						${TotalMediumIssues}" + "					</div>" + "				</div>"
                + "			</div>" + "		</div>";

        private static string htmlStatistics = "<div class=\"col-4\">"
                + "					<div class=\"card block-color text-white text-opacity-75\">"
                + "						<div class=\"card-body\">"
                + "							<div class=\"stats-chart-row\">"
                + "								<div class=\"stats-chart-row-label\"> Critical </div>"
                + "								<div class=\"stats-chart-row-value color-high\"><span class=\"stat-percent\""
                + "										tabindex=\"0\">${highImpactsPercentage}</span>%</div>"
                + "								<div class=\"stats-chart-row-items\"><span class=\"stat-item\" tabindex=\"0\">${highImpactsCount}</span>"
                + "									<span class=\"stat-item-text\" tabindex=\"0\">items</span>"
                + "								</div>"
                + "								<div class=\"stats-chart-row-bar\"> <span"
                + "										class=\"stats-chart-row-bar-value color-high\" style=\"width: ${highImpactsPercentage}%;\"></span>"
                + "								</div>" + "							</div>"
                + "							<div class=\"stats-chart-row\">"
                + "								<div class=\"stats-chart-row-label\"> Medium </div>"
                + "								<div class=\"stats-chart-row-value color-medium\"><span class=\"stat-percent\""
                + "										tabindex=\"0\">${mediumImpactsPercentage}</span>%</div>"
                + "								<div class=\"stats-chart-row-items\"><span class=\"stat-item\" tabindex=\"0\">${mediumImpactsCount}</span>"
                + "									<span class=\"stat-item-text\" tabindex=\"0\">items</span>"
                + "								</div>"
                + "								<div class=\"stats-chart-row-bar\"> <span"
                + "										class=\"stats-chart-row-bar-value color-medium\" style=\"width: ${mediumImpactsPercentage}%;\"></span>"
                + "								</div>" + "							</div>"
                + "							<div class=\"stats-chart-row\">"
                + "								<div class=\"stats-chart-row-label\"> Low </div>"
                + "								<div class=\"stats-chart-row-value color-low\"><span class=\"stat-percent\""
                + "										tabindex=\"0\">${lowImpactsPercentage}</span>%</div>"
                + "								<div class=\"stats-chart-row-items\"><span class=\"stat-item\" tabindex=\"0\">${lowImpactsCount}</span>"
                + "									<span class=\"stat-item-text\" tabindex=\"0\">items</span>"
                + "								</div>"
                + "								<div class=\"stats-chart-row-bar\"> <span"
                + "										class=\"stats-chart-row-bar-value color-low\" style=\"width: ${lowImpactsPercentage}%;\"></span>"
                + "								</div>" + "							</div>"
                + "						</div>"
                + "					</div>" + "				</div>";

        private static string htmlTotalErrors = "<div class=\"col-4\">"
                + "					<div class=\"card block-color text-white text-opacity-75\">"
                + "						<div class=\"card-body\">"
                + "							<div class=\"h6\">TOTAL</div>"
                + "							<span class=\"complaint-text\">Total elements & issues.</span>"
                + "							<br><br>"
                + "							<strong class=\"text-white text-opacity-75\">${totalElements}</strong>"
                + "						</div>" + "					</div>" + "				</div>";

        private static string htmlNonComplaint = "<div class=\"col-4\">"
                + "					<div class=\"card block-color text-white text-opacity-75\">"
                + "						<div class=\"card-body\">"
                + "							<div class=\"h6\">${ComplaintTitle}</div>"
                + "							<span class=\"complaint-text\">${ComplaintMessage}</span>"
                + "							<br><br>"
                + "							<strong class=\"text-white text-opacity-75\">Errors: ${totalErrors}</strong>"
                + "						</div>" + "					</div>" + "				</div>";

        private static string htmlAccordion = "<div class=\"accordion\" id=\"accordionPanelsStayOpen${index}\">"
         + "					<div class=\"accordion-item\">"
         + "					<div class=\"accordion-header\" id=\"heading${index}\">"
         + "					<div class=\"accordion-button text-white text-opacity-75 ${errorBgColor}\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#panelsStayOpen-collapse${index}\" aria-expanded=\"true\" aria-controls=\"panelsStayOpen-collapse${index}\">"
         + "						<div class=\"row col-12 g-2\">" + "<div class=\"col-10 text-start\">${title}</div>"
         + "						<div class=\"col-2\">${highImpactErrorCountMsg}</div></div></div></div>"
         + "					<div id=\"panelsStayOpen-collapse${index}\" class=\"accordion-collapse collapse\" aria-labelledby=\"heading${index}\">"
         + "					<div class=\"accordion-body\">"
         + "							<div class=\"fw-bold mt-3 text-secondary\"><h3>${errorType}</h3></div><br>"
         + "							<div class=\"fw-bold mt-3 text-secondary\">What It Means:</div>"
         + "							<div class=\"card-text mt-3\">${summary}</div>"
         + "							<div class=\"fw-bold mt-3 text-secondary\">Why It Matters:</div>"
         + "							<div class=\"card-text mt-3\">${purpose}</div>"
         + "							<div class=\"fw-bold mt-3 text-secondary\">How to Fix It:</div>"
         + "							<div class=\"card-text mt-3\">${actions}</div>"
         + "							<div class=\"fw-bold mt-3 text-secondary\">Standards and Guidelines:</div>"
         + "							<div class=\"card-text mt-3\">${guideLineCheckList}</div>"
         + "							<div class=\"fw-bold mt-3 text-secondary\">Item's XPath:</div>"
         + "							<ul class=\"mt-3\"><small>${xpathlist}</small></ul>"
         + "					</div></div></div></div>";

        private static string imgModelPopup = "<div><img src=\"{imgPath}\" class=\"border\" width=\"100px\" height=\"100px\" data-bs-toggle=\"modal\" data-bs-target=\"#imgModalLong{pageIndex}\"/></div>"
            + " <div class=\"modal fade bd-example-modal-xl\"  id=\"imgModalLong{pageIndex}\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"imgModalLongTitle{pageIndex}\" aria-hidden=\"true\">"
            + "  <div class=\"modal-dialog modal-xl\" role=\"document\"> <div class=\"modal-content\">"
            + "      <div class=\"modal-header\">"
            + "        <button type=\"button\" class=\"close\" data-bs-dismiss=\"modal\" aria-label=\"Close\">"
            + "          <span aria-hidden=\"true\">&times;</span> </button> </div>"
            + "      <div class=\"modal-body\"> <img src=\"{imgPath}\" width=\"100%\" height=\"100%\"/>"
            + "      </div></div></div></div>";

        private static string GetCriticalMediumIssuesHtml(string html)
        {
            return html.Replace("${TotalCriticalIssues}", totalCriticalIssuesCount.ToString())
                    .Replace("${TotalMediumIssues}", totalMediumIssuesCount.ToString());
        }
       
        private static string GetTotalIssuesHtml(List<AccessibilityStatistic> jsonStatistics)
        {
            var criticalErrors = 0;
            var mediumErrors = 0;
            var pageCount = jsonStatistics.Count();

            foreach (AccessibilityStatistic item in jsonStatistics)
            {
                criticalErrors += Convert.ToInt32(item.Error) + Convert.ToInt32(item.Contrast);
                mediumErrors += Convert.ToInt32(item.Alert);
            }

            htmlTotalIssues = htmlTotalIssues.Replace("${TotalPages}", pageCount.ToString());
                    //.Replace("${TotalCriticalIssues}", criticalErrors.ToString())
                    //.Replace("${TotalMediumIssues}", mediumErrors.ToString());

            return htmlTotalIssues;
        }

        public static string GetHtmlstring()
        {
            var statsData = new Deserializer().DeserializeStatistics();
            var reportsData = new Deserializer().DeserializeResults();
            var html = new StringBuilder();

            var statisticsBlockStyles = HtmlStyles.Styles;
            htmlHeader = htmlHeader.Replace("${statisticsStyles}", statisticsBlockStyles);

            html.Append("<!DOCTYPE html><html>" + htmlHeader + "<body>");
            html.Append("<h1 class=\"mt-4 mb-3\"><center>Accessibility Test Run Report</center></h1>" +
                        "<div class=\"container mt-4 bg-light shadow-lg\"><div class=\"container-fluid p-3\">" +
                        "<div class=\"text-secondary mb-4\">Test Run: " +
                        Start.TestExecutionStartedAt + " - " + Start.TestExecutionEndedAt + "</div>" +
                        GetTotalIssuesHtml(statsData) + "</div></div>");

            var pageIndex = 0;

            foreach (var item in statsData)
            {
                var report = reportsData.FindAll(c => c.URL == item.URL);
                var errorCount = Convert.ToInt32(item.Error);
                var contrastCount = Convert.ToInt32(item.Contrast);
                var alertsCount = Convert.ToInt32(item.Alert);
                var allItemsCount = Convert.ToInt32(item.AllItemCount);
                
                //var ariaCount = 0;
                //var ariaItems = report.FindAll(c => c.Type == "aria");
                //if (ariaItems != null)
                //{
                //    ariaCount = ariaItems.Count;
                //}

                //var structureCount = 0;
                //var structureItems = report.FindAll(c => c.Type == "structure");
                //if (structureItems != null)
                //{
                //    structureCount = structureItems.Count;
                //}

                //var featureCount = 0;
                //var featureItems = report.FindAll(c => c.Type == "feature");
                //if (featureItems != null)
                //{
                //    featureCount = featureItems.Count;
                //}

                var seriousItems = report.FindAll(c => c.Type == "serious");
                var seriousCount = 0;
                if (seriousItems != null)
                {
                    seriousCount = seriousItems.Count;
                }
                var criticalItems = report.FindAll(c => c.Type == "critical");
                var criticalCount = 0;
                if (criticalItems != null)
                {
                    criticalCount = criticalItems.Count;
                }
                var moderateItems = report.FindAll(c => c.Type == "moderate");
                var moderateCount = 0;
                if (moderateItems != null)
                {
                    moderateCount = moderateItems.Count;
                }
                errorCount = errorCount + seriousCount + criticalCount;
                alertsCount = alertsCount + moderateCount;
                var totalErrors = errorCount + contrastCount;

                html.Append("<div class=\"container mt-4 bg-light shadow-lg\"><div class=\"container-fluid p-3\"><h6 class=\"text-secondary\">"
                         + string.Concat("Page ", pageIndex + 1, " - ", item.URL)
                         + "</h6><div class=\"row mt-3\">");

                htmlNonComplaint = totalErrors > 0 ? htmlNonComplaint
                                                    .Replace("${ComplaintTitle}", "NOT COMPLIANT")
                                                    .Replace("${ComplaintMessage}", "This page is at risk of an accessibility issues.") :
                                                    htmlNonComplaint
                                                    .Replace("${ComplaintTitle}", "COMPLIANT")
                                                    .Replace("${ComplaintMessage}", "This page is not at risk of an accessibility issues.");

                html.Append(htmlNonComplaint.Replace("${totalErrors}", totalErrors.ToString()));
                html.Append(htmlTotalErrors.Replace("${totalElements}", allItemsCount.ToString()));

                var highImpactPercentage = ((float)totalErrors / allItemsCount * 100);
                var mediumImpactPercentage = ((float)alertsCount / allItemsCount * 100);
                var lowImpactValue = allItemsCount - totalErrors - alertsCount;
                var lowImpactPercentage = 100.0f - (highImpactPercentage + mediumImpactPercentage);

                var htmlStatisticsstring = htmlStatistics
                        .Replace("${highImpactsPercentage}", highImpactPercentage.ToString("0.00"))
                        .Replace("${highImpactsCount}", totalErrors.ToString())
                        .Replace("${mediumImpactsPercentage}", mediumImpactPercentage.ToString("0.00"))
                        .Replace("${mediumImpactsCount}", alertsCount.ToString())
                        .Replace("${lowImpactsPercentage}", lowImpactPercentage.ToString("0.00"))
                        .Replace("${lowImpactsCount}", lowImpactValue.ToString())
                        ;

                html.Append(htmlStatisticsstring + "</div><br><div id=\"accordion\">");


                if (errorCount > 0)
                {
                    html.Append(GroupJsonByIssueType(report, "error", pageIndex));
                }

                if (contrastCount > 0)
                {
                    html.Append(GroupJsonByIssueType(report, "contrast", pageIndex));
                }

                if (alertsCount > 0)
                {
                    html.Append(GroupJsonByIssueType(report, "alert", pageIndex));
                }

                if (seriousCount > 0)
                {
                    html.Append(GroupJsonByIssueType(report, "serious", pageIndex));
                }

                if (criticalCount > 0)
                {
                    html.Append(GroupJsonByIssueType(report, "critical", pageIndex));
                }

                if (moderateCount > 0)
                {
                    html.Append(GroupJsonByIssueType(report, "moderate", pageIndex));
                }

                //if (ariaCount > 0)
                //{
                //    html.Append(GroupJsonByIssueType(report, "aria", pageIndex));
                //}

                //if (featureCount > 0)
                //{
                //    html.Append(GroupJsonByIssueType(report, "feature", pageIndex));
                //}

                //if (structureCount > 0)
                //{
                //    html.Append(GroupJsonByIssueType(report, "structure", pageIndex));
                //}


                html.Append("</div></div></div>");
                pageIndex++;
            }

            html.Append("</html>");
            var htmlValue = GetCriticalMediumIssuesHtml(html.ToString());
            return htmlValue;
        }

        private static string GroupJsonByIssueType(List<AccessibilityResult> data, string category, int pageIndex)
        {
            var tempHtml = new StringBuilder();
            var reportByCategory = data.FindAll(c => c.Type == category);
            var resultMap = new Dictionary<string, StringBuilder>();

            foreach (var report in reportByCategory)
            {
                var type = report.Title;

                if (!resultMap.ContainsKey(type))
                {
                    resultMap.Add(type, new StringBuilder());
                }

                resultMap[type].Append("<li>" + report.ElementXPath + "</li>");
            }

            foreach (var key in resultMap.Keys)
            {
                var report = data.FindAll(c => c.Type == category && c.Title.Equals(key)).FirstOrDefault();
                tempHtml.Append(AppendErrorsForIssueType(report, resultMap[key].ToString(), category, pageIndex));
            }

            return tempHtml.ToString();
        }

        private static string AppendErrorsForIssueType(AccessibilityResult item, string xpathList, string filterValue, int pageIndex)
        {
            var tempHtml = new StringBuilder();
            var count = xpathList.Split("<li>").Length - 1;
            var impactCategoryMsg = string.Empty;
            var errorBgColor = string.Empty;
            switch (item.Type)
            {
                case "error":
                case "contrast":
                case "critical":
                case "serious":
                    impactCategoryMsg = count + " high impact";
                    errorBgColor = "bg-danger bg-gradient";
                    totalCriticalIssuesCount = totalCriticalIssuesCount +count;
                    break;
                case "alert":
                case "moderate":
                    impactCategoryMsg = count + " medium impact";
                    errorBgColor = "bg-warning";
                    totalMediumIssuesCount = totalMediumIssuesCount + count;
                    break;
                default:
                    impactCategoryMsg = (count) + " low impact";
                    errorBgColor = "bg-success";
                    break;
            }

            var guideLinestring = "";

            foreach (var guideLine in item.GuideLines)
            {
                if (!string.IsNullOrEmpty(guideLine.GuidelineLevel))
                {
                    guideLinestring = guideLinestring + "<a href=\"" + guideLine.GuidelineLink + "\">"
                              + guideLine.GuidelineLevel + " - " + guideLine.GuidelineCode + " - " + guideLine.GuidelineLink + "</a><br>";
                }
            }

            var navigation = filterValue.Replace("(", "").Replace(")", "").Replace(".", "").Replace("-", "").Replace(" ", "").Replace(",", string.Empty);
           
            var title = item.Title.Replace("(", "").Replace(")", "").Replace(".", "").Replace("-", "").Replace(" ", "");
            var titleDisplay = item.Title;
            if (!string.IsNullOrEmpty(item.Tool) && item.Tool.Equals("Axe"))
            {
                titleDisplay = "Axe Violation : " + item.Title;
            }
            var htmlString = htmlAccordion.Replace("${index}", $"{navigation}_{item.Type}_{title}_{pageIndex}")
                  .Replace("${title}", titleDisplay)
                  .Replace("${errorType}", item.Title)
                  .Replace("${errorBgColor}", errorBgColor)
                  .Replace("${highImpactErrorCountMsg}", impactCategoryMsg)
                  .Replace("${summary}", item.Summary)
                  .Replace("${purpose}", item.Purpose)
                  .Replace("${actions}", item.Actions)
                  .Replace("${guideLineCheckList}", guideLinestring)
                  .Replace("${xpathlist}", xpathList);

            tempHtml.Append(htmlString);
            return tempHtml.ToString();
        }
    }
}
