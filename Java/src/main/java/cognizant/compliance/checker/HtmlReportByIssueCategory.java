package cognizant.compliance.checker;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import cognizant.compliance.checker.contracts.GuideLine;
import cognizant.compliance.checker.contracts.WcagReport;
import cognizant.compliance.checker.contracts.WcagStatistics;
import cognizant.compliance.checker.contracts.WcagViolation;
import cognizant.compliance.checker.contracts.WcagViolations;

public class HtmlReportByIssueCategory {

	public String htmlHeader = "<head><title>Accessibility Test Run Report</title>"
			+ " <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css\">"
			+ " <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js\"></script><style>${statisticsStyles}</style>"
			+ "</head>";

	public String htmlTotalIssues = "<div class=\"row mb-3\">" + "            <div class=\"col-4\">"
			+ "             <div class=\"card\">"
			+ "                 <div class=\"card-header h6 block-color text-white text-opacity-75\">"
			+ "                     Total Pages" + "                    </div>"
			+ "                 <div class=\"card-body text-center h6\">" + "                       ${TotalPages}"
			+ "                 </div>" + "             </div>" + "         </div>" + "         <div class=\"col-4\">"
			+ "             <div class=\"card\">"
			+ "                 <div class=\"card-header h6 bg-danger bg-gradient text-white text-opacity-75\">"
			+ "                     Critical Issues" + "                    </div>"
			+ "                 <div class=\"card-body text-center h6\">"
			+ "                     ${TotalCriticalIssues}" + "                 </div>" + "             </div>"
			+ "         </div>" + "         <div class=\"col-4\">" + "              <div class=\"card\">"
			+ "                 <div class=\"card-header h6 bg-warning bg-gradient text-white text-opacity-75\">"
			+ "                     Medium Issues" + "                  </div>"
			+ "                 <div class=\"card-body text-center h6\">" + "                     ${TotalMediumIssues}"
			+ "                   </div>" + "             </div>" + "         </div>" + "     </div>";

	public String htmlStatistics = "<div class=\"col-4\">"
			+ "                 <div class=\"card block-color text-white text-opacity-75\">"
			+ "                     <div class=\"card-body\">"
			+ "                         <div class=\"stats-chart-row\">"
			+ "                             <div class=\"stats-chart-row-label\"> Critical </div>"
			+ "                             <div class=\"stats-chart-row-value color-high\"><span class=\"stat-percent\""
			+ "                                     tabindex=\"0\">${highImpactsPercentage}</span>%</div>"
			+ "                             <div class=\"stats-chart-row-items\"><span class=\"stat-item\" tabindex=\"0\">${highImpactsCount}</span>"
			+ "                                 <span class=\"stat-item-text\" tabindex=\"0\">items</span>"
			+ "                             </div>"
			+ "                             <div class=\"stats-chart-row-bar\"> <span"
			+ "                                     class=\"stats-chart-row-bar-value color-high\" style=\"width: ${highImpactsPercentage}%;\"></span>"
			+ "                             </div>" + "                         </div>"
			+ "                         <div class=\"stats-chart-row\">"
			+ "                             <div class=\"stats-chart-row-label\"> Medium </div>"
			+ "                             <div class=\"stats-chart-row-value color-medium\"><span class=\"stat-percent\""
			+ "                                     tabindex=\"0\">${mediumImpactsPercentage}</span>%</div>"
			+ "                             <div class=\"stats-chart-row-items\"><span class=\"stat-item\" tabindex=\"0\">${mediumImpactsCount}</span>"
			+ "                                 <span class=\"stat-item-text\" tabindex=\"0\">items</span>"
			+ "                             </div>"
			+ "                             <div class=\"stats-chart-row-bar\"> <span"
			+ "                                     class=\"stats-chart-row-bar-value color-medium\" style=\"width: ${mediumImpactsPercentage}%;\"></span>"
			+ "                             </div>" + "                         </div>"
			+ "                         <div class=\"stats-chart-row\">"
			+ "                             <div class=\"stats-chart-row-label\"> Low </div>"
			+ "                             <div class=\"stats-chart-row-value color-low\"><span class=\"stat-percent\""
			+ "                                     tabindex=\"0\">${lowImpactsPercentage}</span>%</div>"
			+ "                             <div class=\"stats-chart-row-items\"><span class=\"stat-item\" tabindex=\"0\">${lowImpactsCount}</span>"
			+ "                                 <span class=\"stat-item-text\" tabindex=\"0\">items</span>"
			+ "                             </div>"
			+ "                             <div class=\"stats-chart-row-bar\"> <span"
			+ "                                     class=\"stats-chart-row-bar-value color-low\" style=\"width: ${lowImpactsPercentage}%;\"></span>"
			+ "                             </div></div></div></div></div>";

	public String htmlTotalErrors = "<div class=\"col-4\">"
			+ "                 <div class=\"card block-color text-white text-opacity-75\">"
			+ "                     <div class=\"card-body\">"
			+ "                         <div class=\"h6\">TOTAL</div>"
			+ "                         <span class=\"complaint-text\">Total issues.</span>"
			+ "                         <br><br>"
			+ "                         <strong class=\"text-white text-opacity-75\">${totalElements}</strong>"
			+ "                     </div>" + "                 </div>" + "             </div>";

	public String htmlNonComplaint = "<div class=\"col-4\">"
			+ "                 <div class=\"card block-color text-white text-opacity-75;\">"
			+ "                     <div class=\"card-body\">"
			+ "                         <div class=\"h6\">${ComplaintTitle}</div>"
			+ "                         <span class=\"complaint-text\">${ComplaintMessage}</span>"
			+ "                         <br><br>"
			+ "                         <strong class=\"text-white text-opacity-75\">Errors: ${totalErrors}</strong>"
			+ "                     </div>" + "                 </div>" + "             </div>";

	public String htmlAccordion = "<div class=\"accordion\" id=\"accordionPanelsStayOpen${index}\">"
			+ "                 <div class=\"accordion-item\">"
			+ "                 <div class=\"accordion-header\" id=\"heading${index}\">"
			+ "                 <div class=\"accordion-button text-white text-opacity-75 ${errorBgColor}\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#panelsStayOpen-collapse${index}\" aria-expanded=\"true\" aria-controls=\"panelsStayOpen-collapse${index}\">"
			+ "                     <div class=\"row col-12 g-2\">" + "<div class=\"col-10 text-start\">${title}</div>"
			+ "                     <div class=\"col-2\">${highImpactErrorCountMsg}</div></div></div></div>"
			+ "                 <div id=\"panelsStayOpen-collapse${index}\" class=\"accordion-collapse collapse\" aria-labelledby=\"heading${index}\">"
			+ "                 <div class=\"accordion-body\">"
			+ "                         <div class=\"fw-bold mt-3 text-secondary\"><h3>${errorType}</h3></div><br>"
			+ "                         <div class=\"fw-bold mt-3 text-secondary\">What It Means:</div>"
			+ "                         <div class=\"card-text mt-3\">${summary}</div>"
			+ "                         <div class=\"fw-bold mt-3 text-secondary\">Why It Matters:</div>"
			+ "                         <div class=\"card-text mt-3\">${purpose}</div>"
			+ "                         <div class=\"fw-bold mt-3 text-secondary\">How to Fix It:</div>"
			+ "                         <div class=\"card-text mt-3\">${actions}</div>"
			+ "                         <div class=\"fw-bold mt-3 text-secondary\">Standards and Guidelines:</div>"
			+ "                         <div class=\"card-text mt-3\">${guideLineCheckList}</div>"
			+ "                         <div class=\"fw-bold mt-3 text-secondary\">Element\'s XPath:</div>"
			+ "                         <ul class=\"mt-3\"><small>${xpathlist}</small></ul>"
			+ "                 </div></div></div></div>";

	public String getHtmlString() throws IOException {

		Map<String, WcagViolations> waveViolations = WcagReport.WaveViolations;
		Map<String, WcagStatistics> statistics = WcagReport.WaveStatistics;
		Map<String, WcagViolations> axeViolations = WcagReport.AxeViolations;

		Map<String, WcagViolations> mergedViolations = new HashMap<>(waveViolations);

		axeViolations.forEach((key, value) -> mergedViolations.merge(key, value, (existing, newList) -> {
			existing.addAll(newList);
			return existing;
		}));

		String startDateTime = WcagReport.StartDateTime;

		StringBuilder html = new StringBuilder();
		String endDateTime = CommonUtils.getCurrentTimeStamp();
		Integer pageIndex = 0;

		String statisticsBlockStyles = HtmlStyles.Styles;
		htmlHeader = htmlHeader.replace("${statisticsStyles}", statisticsBlockStyles);

		html.append("<!DOCTYPE html><html>" + htmlHeader + "<body>");
		html.append(
				"<h1 class=\"mt-4 mb-3\"><center>Accessibility Test Run Report</center></h1><div class=\"container\">"
						+ "<div class=\"alert alert-secondary text-info\">Test Run: " + startDateTime + " - "
						+ endDateTime + "</div>" + getTotalIssuesHtml(statistics, axeViolations) + "</div>");

		for (Map.Entry<String, WcagStatistics> entry : statistics.entrySet()) {

			String pageKey = entry.getKey();
			WcagStatistics statistic = entry.getValue();

			WcagViolations report = mergedViolations.get(pageKey);
			WcagViolations tmpAxeViolations = axeViolations.get(pageKey);

			long axeErrorCount = tmpAxeViolations.stream()
					.filter(item -> item.Category_Code.equals("critical") || item.Category_Code.equals("serious"))
					.count();

			long axeMediumCount = tmpAxeViolations.stream().filter(item -> item.Category_Code.equals("moderate"))
					.count();

			Integer errorCount = statistic.error;
			Integer contrastCount = statistic.contrast;
			Integer alertsCount = statistic.alert;
			Integer axeIntErrorCount = Math.toIntExact(axeErrorCount);
			Integer axeIntMediumCount = Math.toIntExact(axeMediumCount);
			Integer allItemsCount = statistic.allitemcount + axeIntMediumCount + axeIntErrorCount;
			Integer totalErrors = errorCount + contrastCount + axeIntErrorCount;
			Integer totalMedium = alertsCount + axeIntMediumCount;

			htmlNonComplaint = totalErrors > 0
					? htmlNonComplaint.replace("${ComplaintTitle}", "CONFORMANCE").replace("${ComplaintMessage}",
							"This page is at risk of an accessibility issues.")
					: htmlNonComplaint.replace("${ComplaintTitle}", "CONFORMANCE").replace("${ComplaintMessage}",
							"This page is not at risk of an accessibility issues.");

			html.append(
					"<div class=\"container mt-4 rounded-2 bg-light shadow-lg\"><div class=\"container-fluid p-3\"><h6 class=\"text-info\">"
							+ String.format("%s%d%s%s", "Page ", pageIndex + 1, " - ", pageKey)
							+ "</h6><div class=\"row mt-3\">");

			html.append(htmlNonComplaint.replace("${totalErrors}", totalErrors.toString()));
			html.append(htmlTotalErrors.replace("${totalElements}", allItemsCount.toString()));

			Float highImpactPercentage = ((float) totalErrors / allItemsCount * 100);
			Float mediumImpactPercentage = ((float) totalMedium / allItemsCount * 100);
			Integer lowImpactValue = allItemsCount - totalErrors - totalMedium;
			Float lowImpactPercentage = 100.0f
					- (highImpactPercentage.floatValue() + mediumImpactPercentage.floatValue());

			String htmlStatisticsString = htmlStatistics
					.replace("${highImpactsPercentage}", String.format("%.02f", highImpactPercentage))
					.replace("${highImpactsCount}", totalErrors.toString())
					.replace("${mediumImpactsPercentage}", String.format("%.02f", mediumImpactPercentage))
					.replace("${mediumImpactsCount}", totalMedium.toString())
					.replace("${lowImpactsPercentage}", String.format("%.02f", lowImpactPercentage))
					.replace("${lowImpactsCount}", lowImpactValue.toString());

			html.append(htmlStatisticsString + "</div><br><div id=\"accordion\">");

			if (totalErrors > 0) {
				if (!WcagReport.IsError) {
					WcagReport.IsError = true;
				}
			}

			html.append(groupJsonByIssueType(statistic.pageUrl, report, pageIndex));

			html.append("</div></div></div>");

			pageIndex += 1;
		}

		html.append("</body></html>");

		return html.toString();
	}

	public String groupJsonByIssueType(String pageTitle, WcagViolations violations, Integer pageIndex) {
		StringBuilder tempHtml = new StringBuilder();

		Map<String, StringBuilder> resultMap = new HashMap<>();

		for (int i = 0; i < violations.size(); i++) {

			WcagViolation violation = violations.get(i);

			String errorType = violation.Type;
			resultMap.putIfAbsent(errorType, new StringBuilder());
			resultMap.get(errorType).append("<li>" + violation.ElementXPath + "</li>");
		}

		for (Map.Entry<String, StringBuilder> entry : resultMap.entrySet()) {
			String key = entry.getKey();
			String xpathList = entry.getValue().toString();

			tempHtml.append(appendErrorsForIssueType(violations, xpathList, key, pageIndex));
		}

		return tempHtml.toString();
	}

	public String appendErrorsForIssueType(WcagViolations violations, String xpathList, String filterValue,
			Integer pageIndex) {

		StringBuilder tempHtml = new StringBuilder();

		for (int i = 0; i < violations.size(); i++) {
			WcagViolation violation = violations.get(i);

			String value = violation.Type;

			if (value.equals(filterValue)) {

				String categoryCode = violation.Category_Code;
				String title = violation.Title;
				String name = violation.Name;
				Integer count = xpathList.split("<li>").length - 1;
				String summary = violation.Summary;
				String purpose = violation.Purpose;
				String actions = violation.Actions;

				String impactCategoryMsg = "";
				String errorBgColor = "";
				switch (categoryCode) {
				case "error":
				case "critical":
				case "serious":
				case "contrast":
					errorBgColor = "bg-danger bg-gradient";
					impactCategoryMsg = count + " high impact";
					break;
				case "alert":
				case "moderate":
					errorBgColor = "bg-warning bg-gradient";
					impactCategoryMsg = count + " medium impact";
					break;
				default:
					errorBgColor = "bg-success";
					impactCategoryMsg = count + " low impact";
					break;
				}

				String guideLineString = "";
				Map<String, String> getGuideLine = getGuideLine(violation);

				for (Map.Entry<String, String> guideLine : getGuideLine.entrySet()) {
					if (!filterValue.equals("None") && guideLine.getValue().equals(filterValue)) {
						guideLineString = guideLineString + "<a href=\"" + guideLine.getKey() + "\">"
								+ guideLine.getValue() + "</a><br>";
					}
				}

				if (guideLineString == "") {
					guideLineString = "N/A";
				}

				String htmlString = htmlAccordion.replace("${index}", name + "_" + pageIndex)
						.replace("${errorBgColor}", errorBgColor).replace("${title}", title)
						.replace("${errorType}", title).replace("${summary}", summary)
						.replace("${highImpactErrorCountMsg}", impactCategoryMsg).replace("${purpose}", purpose)
						.replace("${actions}", actions).replace("${guideLineCheckList}", guideLineString)
						.replace("${xpathlist}", xpathList);

				tempHtml.append(htmlString);

				break;
			}
		}

		return tempHtml.toString();
	}

	public Map<String, String> getGuideLine(WcagViolation violation) {
		Map<String, String> guidLineList = new HashMap<>();
		List<GuideLine> guideLines = violation.GuideLines;

		if (guideLines.size() >= 0) {
			for (int i = 0; i < guideLines.size(); i++) {
				GuideLine guideLine = guideLines.get(i);

				guidLineList.put(guideLine.link, guideLine.name + " - " + guideLine.level_name);
			}
		} else {
			guidLineList.put("NoGuidLines", "None");
		}

		return guidLineList;
	}

	public String getTotalIssuesHtml(Map<String, WcagStatistics> statistics,
			Map<String, WcagViolations> axeViolations) {
		Integer criticalErrors = 0;
		Integer mediumErrors = 0;
		Integer pageCount = statistics.size();

		for (Map.Entry<String, WcagStatistics> entry : statistics.entrySet()) {

			WcagStatistics statistic = entry.getValue();
			WcagViolations axeViolation = axeViolations.get(entry.getKey());

			long axeErrorCount = axeViolation.stream()
					.filter(item -> item.Category_Code.equals("critical") || item.Category_Code.equals("serious"))
					.count();

			long axeMediumCount = axeViolation.stream().filter(item -> item.Category_Code.equals("moderate")).count();

			criticalErrors += statistic.error + statistic.contrast + Math.toIntExact(axeErrorCount);
			mediumErrors += statistic.alert + Math.toIntExact(axeMediumCount);
		}

		htmlTotalIssues = htmlTotalIssues.replace("${TotalPages}", pageCount.toString())
				.replace("${TotalCriticalIssues}", criticalErrors.toString())
				.replace("${TotalMediumIssues}", mediumErrors.toString());

		return htmlTotalIssues;
	}
}