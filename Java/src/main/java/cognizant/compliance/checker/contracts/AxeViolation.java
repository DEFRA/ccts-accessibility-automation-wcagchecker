package cognizant.compliance.checker.contracts;

import java.util.List;

public class AxeViolation {
	public String id;
    public String impact;
    public List<String> tags;
    public String description;
    public String help;
    public String helpUrl;
    public List<AxeViolationNode> nodes;
}
