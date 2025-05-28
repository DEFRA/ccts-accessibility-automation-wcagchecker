package accessibility.testing.navigate.steps;

import java.util.List;
import org.openqa.selenium.WebDriver;

import accessibility.testing.navigate.model.FindingType;
import accessibility.testing.navigate.pages.navigationPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

public class navigateSteps {

	public static WebDriver driver;
	public navigationPage navigationPage;
	
	public navigateSteps() {
		driver = hooks.getWebDriver();
		this.navigationPage = new navigationPage(driver);		
	} 

	@When("I provide the url {string} and hit enter")
	public void i_provide_the_url_and_hit_enter(String url) {
		navigationPage.navigateUrl(url);
	}
 
	@When("provide the credentials")
	public void i_provide_the_credentials() {
		navigationPage.provideCredentials();
	}
	
	@When("click continue button")
	public void i_click_continue_button() throws InterruptedException {
		navigationPage.clickContinueButton();
	}
	
	@Then("I should be redirected to Defra pages")
	public void i_should_be_redirected_to_defra_pages() {
		// no action
	}

	@Then("I should not see any accessibility issues")
	public void i_should_not_see_any_accessibility_issues() {		
		//no action
	}
	
	@Given("I want to navigate to Defra pages")
	public void i_want_to_navigate_to_defra_pages() {
		//no action
	}
	@Then("I should be redirected to Defra page")
	public void i_should_be_redirected_to_defra_page() {
		// no action
	}
	
	public static String concatAsStrings(List<FindingType> findingTypes, String separator) {
	    StringBuilder sb = new StringBuilder();
	    String sep = "";
	    for(FindingType findingType: findingTypes) {
	        sb.append(sep).append(findingType.getFindingType()+":"+findingType.getCount());
	        sep = separator;
	    }
	    return sb.toString();                           
	}
}
