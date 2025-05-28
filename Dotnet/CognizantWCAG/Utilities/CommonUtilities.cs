namespace Reports.Html.Utilities
{
    using OpenQA.Selenium;

    
    public class CommonUtilities
    {
        public static string GetComponentName(string url)
        {
            var component = string.Empty;

            // find out the component of the web page
            if (url.Contains("registration"))
            {
                component = "REG";
            }
            else if (url.Contains("b2clogin"))
            {
                component = "B2C";
            }
            else if (url.Contains("fakeservice"))
            {
                component = "FakeService";
            }
            else if (url.Contains("management"))
            {
                component = "ACM";
            }
            return component;
        }

        public static void CleanupDirectory(string path)
        {
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }

        public static void GenerateDirectory(string path)
        {
            if (path != null)
            {
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
            }
        }
        
        public static string GetDriverVersion(IWebDriver driver)
        {
            var driverVersion = string.Empty;
            if (string.IsNullOrEmpty(driverVersion))
            {
                ICapabilities capabilities = ((WebDriver)driver).Capabilities;

                if (capabilities != null)
                {
                    driverVersion = (capabilities.GetCapability("chrome") as Dictionary<string, object>)["chromedriverVersion"].ToString();
                    driverVersion = driverVersion?.Substring(0, 13);
                }
            }

            return driverVersion;
        }
    }
}