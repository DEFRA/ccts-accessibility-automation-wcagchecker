namespace Reports.Html.Contract
{
    public class AccessibilityResult
    {
        //public string Order { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Purpose { get; set; }
        public string Actions { get; set; }
        public string ElementXPath { get; set; }
        public string Browser { get; set; }
        public string AudioVideo { get; set; }
        public string URL { get; set; }
        public string Component { get; set; }
        public string Type { get; set; }
        public string Tool { get; set; }
        public List<GuideLine> GuideLines { get; set; } = new List<GuideLine>();
    }
}
