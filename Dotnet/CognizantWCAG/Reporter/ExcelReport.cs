namespace Reports.Html.Reporter
{
    using DocumentFormat.OpenXml;
    using DocumentFormat.OpenXml.Packaging;
    using DocumentFormat.OpenXml.Spreadsheet;
    using Reports.Html.Contract;
    using Reports.Html.Utilities;
    using System.Linq;
    using System.Text;
    using System.Web;
    using Font = DocumentFormat.OpenXml.Spreadsheet.Font;

    public static class ExcelReport
    {

        public static void Generate()
        {
            // Deserialize the json object
            var data = new Deserializer().DeserializeResults();

            var reportsPath = Path.Combine(Start.ReportsDir, "Accessibility_Report_" + DateTime.Now.ToString("dd-MM-yyyy-hh-mm-ss") + ".xlsx");

            if (data != null)
            {
                var headers = new List<string>
               {
                   // "Order",
                   //"Component",
                   "Page URL",
                   "Title",
                   "Summary",
                   "Purpose/Help",
                   "Actions/To Solve",
                   "Element XPATH/Html",
                   "Guideline Code",
                   "Guideline Level/Tags",
                   "Guideline Link/Help URL",
                   "Browser",
                   "Category/Impact",
                   "Tool"
                };

                using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Create(reportsPath, SpreadsheetDocumentType.Workbook))
                {
                    // Add a WorkbookPart to the document.
                    var workbookpart = spreadsheetDocument.AddWorkbookPart();

                    var workbookStylesPart1 = workbookpart.AddNewPart<WorkbookStylesPart>();
                    GenerateWorkbookStylesPartContent(workbookStylesPart1);

                    // Add a WorksheetPart to the WorkbookPart.
                    var worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
                    var sheetData = new SheetData();
                    worksheetPart.Worksheet = new Worksheet(sheetData);

                    // Add Sheets to the Workbook.
                    var sheets = new Sheets();

                    // Append a new worksheet and associate it with the workbook.
                    var sheet = new Sheet()
                    {
                        Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart),
                        SheetId = 1,
                        Name = "Accessibility_Results",
                    };
                    sheetData.Append(CreateHeaderRowForExcel(headers));

                    // write each html in new row
                    foreach (var result in data)
                    {
                        //string component = CommonUtilities.GetComponentName(result.URL);

                        if (result.GuideLines == null || result.GuideLines.Count == 0)
                        {
                            var prepareLine = new Row();
                            //prepareLine.Append(CreateCell(component));
                            prepareLine.Append(CreateCell(result.URL));
                            prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Title)));
                            prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Summary)));
                            prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Purpose)));
                            prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Actions)));
                            prepareLine.Append(CreateCell(result.ElementXPath));
                            prepareLine.Append(CreateCell(" "));
                            prepareLine.Append(CreateCell(" "));
                            prepareLine.Append(CreateCell(" "));
                            prepareLine.Append(CreateCell(result.Browser));
                            prepareLine.Append(CreateCell(result.Type));
                            prepareLine.Append(CreateCell(result.Tool));
                            sheetData.Append(prepareLine);
                        }
                        else
                        {
                            foreach (var guideLine in result.GuideLines)
                            {
                                var prepareLine = new Row();
                                //prepareLine.Append(CreateCell(component));
                                prepareLine.Append(CreateCell(result.URL));
                                prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Title)));
                                prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Summary)));
                                prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Purpose)));
                                prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.Actions)));
                                prepareLine.Append(CreateCell(HttpUtility.HtmlDecode(result.ElementXPath)));
                                prepareLine.Append(CreateCell(guideLine.GuidelineCode));
                                prepareLine.Append(CreateCell(guideLine.GuidelineLevel));
                                prepareLine.Append(CreateCell(guideLine.GuidelineLink));
                                prepareLine.Append(CreateCell(result.Browser));
                                prepareLine.Append(CreateCell(result.Type));
                                prepareLine.Append(CreateCell(result.Tool));
                                sheetData.Append(prepareLine);
                                //order++;
                            }
                        }
                    }

                    sheets.Append(sheet);

                    // add sheets to workbook
                    var workbook = new Workbook();
                    workbook.Append(sheets);
                    workbookpart.Workbook = workbook;

                    // Save Close the document.
                    spreadsheetDocument.Save();
                }
            }
        }

        private static Cell CreateCell(string text, uint styleIndex)
        {
            Cell cell = new Cell();
            cell.StyleIndex = styleIndex;
            cell.DataType = ResolveCellDataTypeOnValue(text);
            cell.CellValue = new CellValue(text);
            return cell;
        }

        private static EnumValue<CellValues> ResolveCellDataTypeOnValue(string text)
        {
            int intVal;
            double doubleVal;
            if (int.TryParse(text, out intVal) || double.TryParse(text, out doubleVal))
            {
                return CellValues.Number;
            }
            else
            {
                return CellValues.String;
            }
        }

        private static Row CreateHeaderRowForExcel(List<string> headers)
        {
            Row workRow = new Row();
            foreach (string header in headers)
            {
                workRow.Append(CreateCell(header, 2U));
            }
            return workRow;
        }

        private static Cell CreateCell(string text)
        {
            Cell cell = new Cell();
            cell.StyleIndex = 1U;
            cell.DataType = ResolveCellDataTypeOnValue(text);
            cell.CellValue = new CellValue(text);
            return cell;
        }

        private static void GenerateWorksheetPartContent(WorksheetPart worksheetPart1, SheetData sheetData1)
        {
            var worksheet1 = new Worksheet() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "x14ac" } };
            worksheet1.AddNamespaceDeclaration("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            worksheet1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            worksheet1.AddNamespaceDeclaration("x14ac", "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac");
            var sheetDimension1 = new SheetDimension() { Reference = "A1" };

            var sheetViews1 = new SheetViews();

            var sheetView1 = new SheetView() { TabSelected = true, WorkbookViewId = (UInt32Value)0U };
            var selection1 = new Selection() { ActiveCell = "A1", SequenceOfReferences = new ListValue<StringValue>() { InnerText = "A1" } };

            sheetView1.Append(selection1);

            sheetViews1.Append(sheetView1);
            var sheetFormatProperties1 = new SheetFormatProperties() { DefaultRowHeight = 15D, DyDescent = 0.25D };

            var pageMargins1 = new PageMargins() { Left = 0.7D, Right = 0.7D, Top = 0.75D, Bottom = 0.75D, Header = 0.3D, Footer = 0.3D };
            worksheet1.Append(sheetDimension1);
            worksheet1.Append(sheetViews1);
            worksheet1.Append(sheetFormatProperties1);
            worksheet1.Append(pageMargins1);
            worksheetPart1.Worksheet = worksheet1;
        }

        private static void GenerateWorkbookStylesPartContent(WorkbookStylesPart workbookStylesPart1)
        {
            var stylesheet1 = new Stylesheet() { MCAttributes = new MarkupCompatibilityAttributes() { Ignorable = "x14ac" } };
            stylesheet1.AddNamespaceDeclaration("mc", "http://schemas.openxmlformats.org/markup-compatibility/2006");
            stylesheet1.AddNamespaceDeclaration("x14ac", "http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac");

            var fonts1 = new Fonts() { Count = (UInt32Value)2U, KnownFonts = true };

            var font1 = new Font();
            var fontSize1 = new FontSize() { Val = 11D };
            var color1 = new Color() { Theme = (UInt32Value)1U };
            var fontName1 = new FontName() { Val = "Calibri" };
            var fontFamilyNumbering1 = new FontFamilyNumbering() { Val = 2 };
            var fontScheme1 = new FontScheme() { Val = FontSchemeValues.Minor };

            font1.Append(fontSize1);
            font1.Append(color1);
            font1.Append(fontName1);
            font1.Append(fontFamilyNumbering1);
            font1.Append(fontScheme1);

            var font2 = new Font();
            var bold1 = new Bold();
            var fontSize2 = new FontSize() { Val = 11D };
            var color2 = new Color() { Theme = (UInt32Value)1U };
            var fontName2 = new FontName() { Val = "Calibri" };
            var fontFamilyNumbering2 = new FontFamilyNumbering() { Val = 2 };
            var fontScheme2 = new FontScheme() { Val = FontSchemeValues.Minor };

            font2.Append(bold1);
            font2.Append(fontSize2);
            font2.Append(color2);
            font2.Append(fontName2);
            font2.Append(fontFamilyNumbering2);
            font2.Append(fontScheme2);

            fonts1.Append(font1);
            fonts1.Append(font2);

            var fills1 = new Fills() { Count = (UInt32Value)2U };

            var fill1 = new Fill();
            var patternFill1 = new PatternFill() { PatternType = PatternValues.None };

            fill1.Append(patternFill1);

            var fill2 = new Fill();
            var patternFill2 = new PatternFill() { PatternType = PatternValues.Gray125 };

            fill2.Append(patternFill2);

            fills1.Append(fill1);
            fills1.Append(fill2);

            var borders1 = new Borders() { Count = (UInt32Value)2U };

            var border1 = new Border();
            var leftBorder1 = new LeftBorder();
            var rightBorder1 = new RightBorder();
            var topBorder1 = new TopBorder();
            var bottomBorder1 = new BottomBorder();
            var diagonalBorder1 = new DiagonalBorder();

            border1.Append(leftBorder1);
            border1.Append(rightBorder1);
            border1.Append(topBorder1);
            border1.Append(bottomBorder1);
            border1.Append(diagonalBorder1);

            var border2 = new Border();

            var leftBorder2 = new LeftBorder() { Style = BorderStyleValues.Thin };
            var color3 = new Color() { Indexed = (UInt32Value)64U };

            leftBorder2.Append(color3);

            var rightBorder2 = new RightBorder() { Style = BorderStyleValues.Thin };
            var color4 = new Color() { Indexed = (UInt32Value)64U };

            rightBorder2.Append(color4);

            var topBorder2 = new TopBorder() { Style = BorderStyleValues.Thin };
            var color5 = new Color() { Indexed = (UInt32Value)64U };

            topBorder2.Append(color5);

            var bottomBorder2 = new BottomBorder() { Style = BorderStyleValues.Thin };
            var color6 = new Color() { Indexed = (UInt32Value)64U };

            bottomBorder2.Append(color6);
            var diagonalBorder2 = new DiagonalBorder();

            border2.Append(leftBorder2);
            border2.Append(rightBorder2);
            border2.Append(topBorder2);
            border2.Append(bottomBorder2);
            border2.Append(diagonalBorder2);

            borders1.Append(border1);
            borders1.Append(border2);

            CellStyleFormats cellStyleFormats1 = new CellStyleFormats() { Count = (UInt32Value)1U };
            CellFormat cellFormat1 = new CellFormat() { NumberFormatId = (UInt32Value)0U, FontId = (UInt32Value)0U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)0U };

            cellStyleFormats1.Append(cellFormat1);

            CellFormats cellFormats1 = new CellFormats() { Count = (UInt32Value)3U };
            CellFormat cellFormat2 = new CellFormat() { NumberFormatId = (UInt32Value)0U, FontId = (UInt32Value)0U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)0U, FormatId = (UInt32Value)0U };
            CellFormat cellFormat3 = new CellFormat() { NumberFormatId = (UInt32Value)0U, FontId = (UInt32Value)0U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)1U, FormatId = (UInt32Value)0U, ApplyBorder = true };
            CellFormat cellFormat4 = new CellFormat() { NumberFormatId = (UInt32Value)0U, FontId = (UInt32Value)1U, FillId = (UInt32Value)0U, BorderId = (UInt32Value)1U, FormatId = (UInt32Value)0U, ApplyFont = true, ApplyBorder = true };

            cellFormats1.Append(cellFormat2);
            cellFormats1.Append(cellFormat3);
            cellFormats1.Append(cellFormat4);

            CellStyles cellStyles1 = new CellStyles() { Count = (UInt32Value)1U };
            CellStyle cellStyle1 = new CellStyle() { Name = "Normal", FormatId = (UInt32Value)0U, BuiltinId = (UInt32Value)0U };

            cellStyles1.Append(cellStyle1);
            DifferentialFormats differentialFormats1 = new DifferentialFormats() { Count = (UInt32Value)0U };
            TableStyles tableStyles1 = new TableStyles() { Count = (UInt32Value)0U, DefaultTableStyle = "TableStyleMedium2", DefaultPivotStyle = "PivotStyleLight16" };

            StylesheetExtensionList stylesheetExtensionList1 = new StylesheetExtensionList();

            StylesheetExtension stylesheetExtension1 = new StylesheetExtension() { Uri = "{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" };
            stylesheetExtension1.AddNamespaceDeclaration("x14", "http://schemas.microsoft.com/office/spreadsheetml/2009/9/main");
            //X14.SlicerStyles slicerStyles1 = new X14.SlicerStyles() { DefaultSlicerStyle = "SlicerStyleLight1" };

            //stylesheetExtension1.Append(slicerStyles1);

            StylesheetExtension stylesheetExtension2 = new StylesheetExtension() { Uri = "{9260A510-F301-46a8-8635-F512D64BE5F5}" };
            stylesheetExtension2.AddNamespaceDeclaration("x15", "http://schemas.microsoft.com/office/spreadsheetml/2010/11/main");
            //X15.TimelineStyles timelineStyles1 = new X15.TimelineStyles() { DefaultTimelineStyle = "TimeSlicerStyleLight1" };

            //stylesheetExtension2.Append(timelineStyles1);

            stylesheetExtensionList1.Append(stylesheetExtension1);
            stylesheetExtensionList1.Append(stylesheetExtension2);

            stylesheet1.Append(fonts1);
            stylesheet1.Append(fills1);
            stylesheet1.Append(borders1);
            stylesheet1.Append(cellStyleFormats1);
            stylesheet1.Append(cellFormats1);
            stylesheet1.Append(cellStyles1);
            stylesheet1.Append(differentialFormats1);
            stylesheet1.Append(tableStyles1);
            stylesheet1.Append(stylesheetExtensionList1);
            workbookStylesPart1.Stylesheet = stylesheet1;
        }
    }
}
