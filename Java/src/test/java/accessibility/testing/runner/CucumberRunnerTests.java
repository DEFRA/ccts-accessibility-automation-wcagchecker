package accessibility.testing.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(tags = "", features = {"src/test/resources/features"}, glue = {"accessibility.testing.navigate.steps"})
    
public class CucumberRunnerTests extends AbstractTestNGCucumberTests {
    
}