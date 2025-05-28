package accessibility.testing.navigate.pages;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.CacheLookup;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import accessibility.testing.navigate.model.*;

public class summaryTab {

	public WebDriver driver;
	public boolean isError;

	@CacheLookup
	@FindBy(xpath = "//div[@id='numbers']//ul/li")
	public List<WebElement> findings;

	public summaryTab(WebDriver driver) {
		this.driver = driver;
		PageFactory.initElements(this.driver, this); 
	}

	public Summary getSummary() {
		List<FindingType> summaryDetails = new ArrayList<FindingType>();
		isError = false;
		for (WebElement webElement : findings) {

			String category = webElement.getText();
			String errorType = category.split("\n")[1];

			int count = Integer.parseInt(webElement.findElement(By.tagName("span")).getText());

			if (errorType.contains("Error") && count > 0) {
				isError = true;
			}

			summaryDetails.add(new FindingType() {
				{
					setCount(count);
					setFindingType(errorType);
				}
			});
		}

		Summary summary = new Summary() {
			{
				setFindingTypes(summaryDetails);
				setIsError(isError);
			}
		};

		return summary;
	}
}
