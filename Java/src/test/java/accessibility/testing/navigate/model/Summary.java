package accessibility.testing.navigate.model;

import java.util.List;

public class Summary {
	public List<FindingType> FindingTypes;
	public boolean IsError;

	public List<FindingType> getFindingTypes() {
		return FindingTypes;
	}

	public void setFindingTypes(List<FindingType> findingTypes) {
		this.FindingTypes = findingTypes;
	}

	public boolean isIsError() {
		return IsError;
	}

	public void setIsError(boolean isError) {
		this.IsError = isError;
	}
}
