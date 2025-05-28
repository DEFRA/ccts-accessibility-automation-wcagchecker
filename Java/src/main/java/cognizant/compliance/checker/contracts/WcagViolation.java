package cognizant.compliance.checker.contracts;

import java.util.ArrayList;
import java.util.List;

public class WcagViolation {
	public String Name;
	public String Url;
	public String Title;
	public String Summary;
	public String Purpose;
	public String Actions;	
	public String Details;
	public String Type;
	public String ElementXPath;
	public String Category_Code;
	public String Tool;
	public List<GuideLine> GuideLines = new ArrayList<>();
}
