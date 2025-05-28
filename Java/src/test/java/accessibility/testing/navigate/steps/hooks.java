package accessibility.testing.navigate.steps;

import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Duration;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.Assert;

import cognizant.compliance.checker.*;
import cognizant.compliance.checker.contracts.WcagReport;
import io.cucumber.java.AfterAll;
import io.cucumber.java.BeforeAll;

public class hooks {

	public static WebDriver driver;
	public final static int TIMEOUT = 10;
	public static WcagAnalyzer accessibilityTestExecutor = new WcagAnalyzer();

	@BeforeAll
	public static void setUp() throws IOException, URISyntaxException {

		System.setProperty("webdriver.chrome.driver", "src/test/resources/drivers/chromedriver.exe");

		ChromeOptions options = new ChromeOptions();
		// options.addArguments("--headless=new");

		driver = new ChromeDriver(options);
		
		accessibilityTestExecutor.init();

		driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(TIMEOUT));
		driver.manage().window().maximize();
	}

	@AfterAll
	public static void teardown() throws IOException {
		try {
			FileWriter htmlWriter = new FileWriter("Accessibility-Test-Result.json");
			htmlWriter.write(new JsonReport().getJsonReport());
			htmlWriter.close();
			
			FileWriter htmlWriter2 = new FileWriter("Accessibility-Test-Result1.html");
			htmlWriter2.write(new HtmlReportByIssueCategory().getHtmlString());
			htmlWriter2.close();

			FileWriter htmlWriter3 = new FileWriter("Accessibility-Test-Result2.html");
			htmlWriter3.write(new HtmlReportByGuidLines().getHtmlString());
			htmlWriter3.close();
			
			System.out.println("Successfully wrote json report.");

			Assert.assertEquals(WcagReport.IsError, false, "Accessibility issues found!");
			
		} catch (Exception e) {
			// Assert for error
		} finally {
			driver.quit();
		}
	}

	public static WebDriver getWebDriver() {
		return driver;
	}
}
