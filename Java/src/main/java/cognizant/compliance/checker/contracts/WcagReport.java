package cognizant.compliance.checker.contracts;

import java.util.HashMap;
import java.util.Map;

public class WcagReport {
	public static String StartDateTime;
	public static Map<String, String> VisitedPageUrls = new HashMap<>();
	public static Map<String, WcagViolations> WaveViolations = new HashMap<>();
	public static Map<String, WcagStatistics> WaveStatistics = new HashMap<>();
	public static Map<String, WcagViolations> AxeViolations = new HashMap<>();
	public static boolean IsError = false;
}
