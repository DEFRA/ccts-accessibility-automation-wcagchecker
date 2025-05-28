package cognizant.compliance.checker;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONArray;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.octomix.josson.commons.StringEscapeUtils;

import cognizant.compliance.checker.contracts.AxeViolation;
import cognizant.compliance.checker.contracts.AxeViolationNode;
import cognizant.compliance.checker.contracts.AxeViolations;
import cognizant.compliance.checker.contracts.GuideLine;
import cognizant.compliance.checker.contracts.WcagReport;
import cognizant.compliance.checker.contracts.WcagStatistics;
import cognizant.compliance.checker.contracts.WcagViolation;
import cognizant.compliance.checker.contracts.WcagViolations;

public class WcagResultsProcessor {

	public static WcagStatistics deserializeStatistic(String jsonStatistics) {
		WcagStatistics statsData = new WcagStatistics();
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		try {
			statsData = mapper.readValue(jsonStatistics, WcagStatistics.class);
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return statsData;
	}

	public static WcagViolations deserializeAxeResults(String axeResults, String url) {

		WcagViolations wcagViolations = new WcagViolations();
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

		AxeViolations axeViolations = new AxeViolations();

		try {
			axeViolations = mapper.readValue(axeResults, AxeViolations.class);

			for (AxeViolation axeViolation : axeViolations.violations) {
				WcagViolation wcagViolation = new WcagViolation();
				StringBuilder toSolveValue = new StringBuilder();
				StringBuilder tags = new StringBuilder();

				for (String tag : axeViolation.tags) {
					tags.append(", ").append(tag);
				}

				if (tags.length() > 2) {
					tags.delete(0, 2); // Remove comma at the beginning
				}

				for (AxeViolationNode axeViolationNode : axeViolation.nodes) {

					for (String action : axeViolationNode.all) {
						toSolveValue.append(", ").append(action);
					}

					if (toSolveValue.length() > 2) {
						toSolveValue.delete(0, 2); // Remove comma at the beginning
					}

					String htmlElement = StringEscapeUtils.escapeHtml4(axeViolationNode.html).trim().replace("\r\n", "")
							.replace("\n", "").replace("  ", "");

					wcagViolation.Summary = axeViolation.description;
					wcagViolation.Purpose = axeViolation.help;
					wcagViolation.Actions = toSolveValue.toString().trim().replace("\r\n", "");
					wcagViolation.ElementXPath = htmlElement;
					wcagViolation.Type = axeViolation.id;
					wcagViolation.Category_Code = axeViolation.impact;
					wcagViolation.Tool = "Axe";
					wcagViolation.Title = "Axe violation - " + axeViolation.id;
					wcagViolation.GuideLines = new ArrayList<>();
					wcagViolation.Url = url;

					// Adding a guideline entry
					GuideLine guideline = new GuideLine();
					guideline.name = "Axe Violation";
					guideline.code = "";
					guideline.link = axeViolation.helpUrl;
					guideline.level_name = tags.toString().trim().replace("\r\n", "");
					wcagViolation.GuideLines.add(guideline);

					if (!WcagReport.IsError) {
						if (axeViolation.impact.equals("critical") || axeViolation.impact.equals("serious")) {
							WcagReport.IsError = true;
						}
					}

					wcagViolations.add(wcagViolation);
				}
			}

		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}

		return wcagViolations;
	}

	public static WcagViolations deserializeWaveResults(String waveResults, String url) {

		JSONObject root = new JSONObject(waveResults);

		WcagViolations allViolations = new WcagViolations();

		for (String key : new String[] { "error", "alert", "contrast" }) {
			if (root.has(key)) {
				JSONArray section = root.getJSONArray(key);
				for (int i = 0; i < section.length(); i++) {
					JSONObject obj = section.getJSONObject(i);
					WcagViolation violation = new WcagViolation();

					violation.Type = obj.optString("type");
					JSONObject data = obj.getJSONObject("data");
					violation.ElementXPath = parseAlertXPath(obj.optString("itemXPath"), key);

					violation.Name = data.optString("name");
					violation.Title = data.optString("title");
					violation.Summary = data.optString("summary");
					violation.Purpose = data.optString("purpose");
					violation.Actions = data.optString("actions");
					violation.Details = data.optString("details");
					violation.Category_Code = data.optString("cat_code");
					violation.Type = data.optString("cat_code");
					violation.Tool = "Wave";
					violation.Url = url;

					if (!WcagReport.IsError) {
						if (violation.Category_Code.equals("contrast") || violation.Category_Code.equals("error")) {
							WcagReport.IsError = true;
						}
					}

					if (data.has("guidelines")) {
						Object guideLinesObj = data.get("guidelines");

						if (guideLinesObj instanceof JSONArray) {

							GuideLine guide = new GuideLine();
							guide.name = "None";
							guide.link = "";
							guide.code = "";
							guide.level_name = "";
							violation.GuideLines.add(guide);

						} else {

							JSONObject guideLines = data.getJSONObject("guidelines");
							Iterator<String> keys = guideLines.keys();

							if (keys.hasNext()) {
								while (keys.hasNext()) {
									String guidLineKey = keys.next();
									JSONObject g = guideLines.getJSONObject(guidLineKey);

									GuideLine guide = new GuideLine();
									guide.name = g.optString("name");
									guide.link = g.optString("link");
									guide.code = g.optString("code");
									guide.level_name = g.optString("level_name");
									violation.GuideLines.add(guide);
								}
							} else {

								GuideLine guide = new GuideLine();
								guide.name = "None";
								guide.link = "";
								guide.code = "";
								guide.level_name = "";
								violation.GuideLines.add(guide);
							}
						}
					}
					allViolations.add(violation);
				}
			}
		}

		return allViolations;

	}

	public static String cleanText(String text) {
		return text.trim().replace("\r\n", "").replace("\n", "").replace("  ", "");
	}

	public static String parseAlertXPath(String xpath, String category) {
		if (category.equals("alert")) {
			Pattern pattern = Pattern.compile("DIV\\[(\\d+)\\]");
			Matcher matcher = pattern.matcher(xpath);
			StringBuffer updatedXpath = new StringBuffer();

			if (matcher.find()) {
				int newIndex = Integer.parseInt(matcher.group(1)) - 1;
				matcher.appendReplacement(updatedXpath, "DIV[" + newIndex + "]");
			}
			matcher.appendTail(updatedXpath);

			return updatedXpath.toString();
		}
		return xpath;
	}
}
