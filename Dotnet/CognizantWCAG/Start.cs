using OpenQA.Selenium;
using Reports.Html.Utilities;
using System.Net.Http.Headers;
using System.Text;

namespace Reports.Html
{

    public class Start
    {
        private static string ExecutionDir = string.Empty;
        private static string ExtensionDownloadDir = string.Empty;
        private static string ExtensionDownloadFilePath = string.Empty;
        private static string UnzippedFile = string.Empty;
        private static string JsFilepath = string.Empty;
        internal static string ReportsDir = string.Empty;
        public static readonly string TestExecutionStartedAt = DateTime.UtcNow.ToString("dd-MM-yyyy-hh-mm-ss");
        public static string TestExecutionEndedAt = string.Empty;
        public static string JsRuleScript = string.Empty;

        public static void Init(IWebDriver driver, string reportPath, bool isHardDownload = false)
        {
            int indexOfFirstSlash = reportPath.IndexOf("\\");
            if (indexOfFirstSlash > 0)
            {
                ExecutionDir = reportPath.Substring(0, indexOfFirstSlash);
            }
            else
                ExecutionDir = reportPath;

            SetPathVariables(reportPath);
            CommonUtilities.GenerateDirectory(ReportsDir);

            if (isHardDownload)
            {
                CommonUtilities.GenerateDirectory(ExtensionDownloadDir);
                CommonUtilities.GenerateDirectory(UnzippedFile);

                DownloadWaveExtension(CommonUtilities.GetDriverVersion(driver));
                ExtractAll(ExtensionDownloadFilePath, UnzippedFile);

                JsRuleScript = RetrieveJSFromSource();
            }
            else
            {
                JsRuleScript = GetMainJsContent().Result;
            }

            Console.WriteLine("AccessibilityLog: Initialize is executed successfully");
        }

        private static void ExtractAll(string zipFilePath, string destDirPath)
        {
            if (File.Exists(JsFilepath))
            {
                Console.WriteLine("AccessibilityLog: javascript file already exists at : " + JsFilepath);
                return;
            }

            System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, destDirPath);

            WriteJs(JsFilepath);

            Console.WriteLine("AccessibilityLog: zip file ExtractToDirectory completed here : " + destDirPath);
        }


        private static void DownloadWaveExtension(string driverVersion)
        {
            if (File.Exists(JsFilepath) && (DateTime.UtcNow - File.GetCreationTimeUtc(JsFilepath)).Days <= 30)
            {
                return;
            }

            var url = string.Format("https://clients2.google.com/service/update2/crx?response=redirect&prodversion={0}&x=id%3Djbbplnpkjmmeebjpijfedlgcdilocofh%26installsource%3Dondemand%26uc&nacl_arch=x86-64&acceptformat=crx2,crx3", driverVersion);
            CommonUtilities.CleanupDirectory(ExtensionDownloadDir);
            CommonUtilities.GenerateDirectory(ExtensionDownloadDir);
            var client = new HttpClient();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = client.GetAsync(url).Result;
            
            if (response.IsSuccessStatusCode)
            {
                CreateFileFromByteArray(response.Content.ReadAsByteArrayAsync().Result, ExtensionDownloadFilePath);
                Console.WriteLine("AccessibilityLog: Extension downloaded!");
            }
        }


        private static void CreateFileFromByteArray(byte[] buf, string fileName)
        {
            FileStream? outputStream = null;

            try
            {
                int publicKeyLength, signatureLength, header, zipStartOffset;
                if (buf[4] == 2)
                {
                    header = 16;
                    publicKeyLength = 0 + buf[8] + (buf[9] << 8) + (buf[10] << 16) + (buf[11] << 24);
                    signatureLength = 0 + buf[12] + (buf[13] << 8) + (buf[14] << 16) + (buf[15] << 24);
                    zipStartOffset = header + publicKeyLength + signatureLength;
                }
                else
                {
                    publicKeyLength = 0 + buf[8] + (buf[9] << 8) + (buf[10] << 16) + (buf[11] << 24 >>> 0);
                    zipStartOffset = 12 + publicKeyLength;
                }

                byte[] output = new byte[buf.Length - zipStartOffset];
                Array.Copy(buf, zipStartOffset, output, 0, output.Length);

                outputStream = new FileStream(fileName, FileMode.CreateNew);
                outputStream.Write(output);
                outputStream.Close();
            }
            catch (IOException ex)
            {
                throw new Exception(ex.Message.ToString());
            }
            finally
            {
                outputStream?.Close();
            }
        }

        private static string RetrieveJSFromSource()
        {
            return File.ReadAllText(JsFilepath, Encoding.UTF8);
        }

        private static void WriteJs(string fileName)
        {
            var jsScript = File.ReadAllText(fileName, Encoding.UTF8)
                              .Replace("t.src=waveconfig.extensionUrl+\"sidebar.html\"", "t.src=waveconfig.extensionUrl")
                              .Replace("sidebarWidth:\"380px\",topbarHeight:\"50px\"", "sidebarWidth:\"0px\",topbarHeight:\"0px\"");

            jsScript = "window.violations=function(){return wave.report.things._iconsByGroup;}\n"
                      + "window.statistics=function(){return wave.results.statistics;}\n"
                      + "window.hideAllIcons=function(){wave.report.things.hideAll();}\n" + jsScript;

            File.WriteAllText(fileName, jsScript);

            Console.WriteLine("AccessibilityLog: WriteJs completed here : " + fileName);
        }

        private static void SetPathVariables(string reportPath)
        {
            ExtensionDownloadDir = Path.Combine(ExecutionDir, "Temp", "Tool", "AXT");
            ExtensionDownloadFilePath = Path.Combine(ExtensionDownloadDir, "AXT.zip");
            UnzippedFile = Path.Combine(ExtensionDownloadDir, "XTN", "AXT");
            JsFilepath = Path.Combine(UnzippedFile, "wave.min.js");
            ReportsDir = reportPath; // Path.Combine(reportPath, "Reports");
        }

        private async static Task<string> GetMainJsContent()
        {
            var url = "https://sareportingpoc.blob.core.windows.net/wcag/wave.min.js";
            var content = string.Empty;

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode();
                    var resultContent = await response.Content.ReadAsStringAsync();

                    content = resultContent;
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine($"Request error: {e.Message}");
                }
            }

            return content;
        }
    }
}