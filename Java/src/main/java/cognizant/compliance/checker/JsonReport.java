package cognizant.compliance.checker;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;
import cognizant.compliance.checker.contracts.WcagReport;
import cognizant.compliance.checker.contracts.WcagStatistics;
import cognizant.compliance.checker.contracts.WcagViolation;
import cognizant.compliance.checker.contracts.WcagViolations;

public class JsonReport {

	public String getJsonReport() {

		JSONArray summary = createSummary(WcagReport.WaveStatistics, WcagReport.AxeViolations);
		JSONArray overView = createOverView(WcagReport.WaveStatistics, WcagReport.AxeViolations);

		Map<String, WcagViolations> waveViolations = WcagReport.WaveViolations;
		Map<String, WcagViolations> axeViolations = WcagReport.AxeViolations;

		Map<String, WcagViolations> mergedViolations = new HashMap<>(waveViolations);

		axeViolations.forEach((key, value) -> mergedViolations.merge(key, value, (existing, newList) -> {
			existing.addAll(newList);
			return existing;
		}));

		Collection<WcagViolations> allViolations = mergedViolations.values();

		JSONArray jsonCollection = new JSONArray();

		for (ArrayList<WcagViolation> violations : allViolations) {
			JSONArray jsonArray = new JSONArray();
			for (WcagViolation violation : violations) {
				jsonArray.put(toJsonObject(violation));
			}
			jsonCollection.put(jsonArray);
		}

		JSONObject jsonReport = new JSONObject();
		jsonReport.put("overview", overView);
		jsonReport.put("summary", summary);
		jsonReport.put("details", jsonCollection);

		return jsonReport.toString();
	}

	public static JSONArray createSummary(Map<String, WcagStatistics> waveStatsData,
			Map<String, WcagViolations> axeViolations) {

		JSONArray summary = new JSONArray();

		for (Map.Entry<String, WcagStatistics> entry : waveStatsData.entrySet()) {

			String pageKey = entry.getKey();
			WcagStatistics statistic = entry.getValue();
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

			Integer totalAllItems = allItemsCount + axeIntErrorCount + axeIntMediumCount;

			JSONObject childObj = new JSONObject();
			childObj.put("allItemsCount", allItemsCount);
			childObj.put("totalElements", totalAllItems);
			childObj.put("pageTitle", statistic.pagetitle);
			childObj.put("critical", totalErrors);
			childObj.put("medium", totalMedium);
			childObj.put("low", totalAllItems - (totalErrors + totalMedium));
			childObj.put("url", pageKey);

			summary.put(childObj);
		}

		return summary;
	}

	public static JSONArray createOverView(Map<String, WcagStatistics> waveStatsData,
			Map<String, WcagViolations> axeViolations) {

		JSONArray overView = new JSONArray();

		Integer totalErrors = 0;
		Integer totalMedium = 0;
		Integer totalLow = 0;
		Integer pageSize = 0;

		for (Map.Entry<String, WcagStatistics> entry : waveStatsData.entrySet()) {

			String pageKey = entry.getKey();
			WcagStatistics statistic = entry.getValue();
			WcagViolations tmpAxeViolations = axeViolations.get(pageKey);

			long axeErrorCount = tmpAxeViolations.stream()
					.filter(item -> item.Category_Code.equals("critical") || item.Category_Code.equals("serious"))
					.count();

			long axeMediumCount = tmpAxeViolations.stream().filter(item -> item.Category_Code.equals("moderate"))
					.count();

			Integer axeError = Math.toIntExact(axeErrorCount);
			Integer axeMedium = Math.toIntExact(axeMediumCount);

			totalErrors += statistic.error + statistic.contrast + axeError;
			totalMedium += statistic.alert + axeMedium;

			totalLow += statistic.allitemcount
					- (statistic.error + statistic.alert + statistic.contrast + axeError + axeMedium);
			pageSize += 1;
		}

		JSONObject childObj = new JSONObject();
		childObj.put("totalPages", pageSize);
		childObj.put("critical", totalErrors);
		childObj.put("medium", totalMedium);
		childObj.put("low", totalLow);

		overView.put(childObj);

		return overView;
	}

	private static JSONObject toJsonObject(WcagViolation violation) {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("url", violation.Url);
		jsonObject.put("Title", violation.Title);
		jsonObject.put("Summary", violation.Summary);
		jsonObject.put("Purpose", violation.Purpose);
		jsonObject.put("Actions", violation.Actions);
		jsonObject.put("ElementXPath", violation.ElementXPath);
		jsonObject.put("Type", violation.Type);
		jsonObject.put("Tool", violation.Tool);
		jsonObject.put("GuideLines", violation.GuideLines.size() > 0 ? violation.GuideLines : new JSONArray());
		jsonObject.put("Title", violation.Title);

		return jsonObject;
	}
}
