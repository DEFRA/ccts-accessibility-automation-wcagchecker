package cognizant.compliance.checker.contracts;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class WcagStatistics {
	public int allitemcount;
	public int totalelements;
	public String pagetitle;
	public String pageUrl;
	public int error;
	public int contrast;
	public int alert;
}