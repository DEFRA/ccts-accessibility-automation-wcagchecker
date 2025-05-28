package accessibility.testing.navigate.pages;


import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.logging.LogEntries;
import org.openqa.selenium.logging.LogEntry;
import org.openqa.selenium.logging.LogType;

import cognizant.compliance.checker.*;

public class navigationPage {

	public WebDriver driver;

	public navigationPage(WebDriver driver) {
		this.driver = driver;
	}

	public void navigateUrl(String url) {
		driver.get(url);
		
		new cognizant.compliance.checker.WcagAnalyzer().analyse(driver);
	}
	
	public void analyzeLog() {
        LogEntries logEntries = driver.manage().logs().get(LogType.BROWSER);
        for (LogEntry entry : logEntries) {
            System.out.println(entry.getLevel() + " " + entry.getMessage());
        }
    }
	
	public void provideCredentials() {
		WebElement userName=driver.findElement(By.id("user_id"));
		WebElement password=driver.findElement(By.id("password"));
		
		userName.sendKeys("78 24 41 02 11 52");
		password.sendKeys("Exports123");
	}
	
	public void clickContinueButton() throws InterruptedException {

		WebElement button=driver.findElement(By.id("continue"));
		button.click();
		
		Thread.sleep(5000);
		
		WebElement startButton=driver.findElement(By.id("link-startNewApplicationLink"));
		startButton.click();
		
		Thread.sleep(5000);
		
		new WcagAnalyzer().analyse(driver);
	}
}
