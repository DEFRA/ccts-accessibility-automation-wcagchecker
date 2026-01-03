import { getDateString, getStyles, deserializedAxeResults, deserializedLighthouseResults } from "./utils.js";
import { wcagResult } from "./global.js";

let htmlHeader =
    "<head>" +
    "   <title>Accessibility Test Run Report</title>" +
    ' <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">' +
    ' <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script><style>${statisticsStyles}</style>' +
    "</head>";

let htmlTotalIssues =
    '<div class="row mb-3">' +
    '            <div class="col-4">' +
    '             <div class="card">' +
    '                 <div class="card-header h6 block-color text-white text-opacity-75">' +
    "                     Total Pages" +
    "                    </div>" +
    '                 <div class="card-body text-center h6">' +
    "                       ${TotalPages}" +
    "                 </div>" +
    "             </div>" +
    "         </div>" +
    '         <div class="col-4">' +
    '             <div class="card">' +
    '                 <div class="card-header h6 bg-danger bg-gradient text-white text-opacity-75">' +
    "                     Critical+Serious Issues" +
    "                    </div>" +
    '                 <div class="card-body text-center h6">' +
    "                     ${TotalCriticalIssues}" +
    "                 </div>" +
    "             </div>" +
    "         </div>" +
    '         <div class="col-4">' +
    '              <div class="card">' +
    '                 <div class="card-header h6 bg-warning bg-gradient text-white text-opacity-75">' +
    "                     Medium Issues" +
    "                  </div>" +
    '                 <div class="card-body text-center h6">' +
    "                     ${TotalMediumIssues}" +
    "                   </div>" +
    "             </div>" +
    "         </div>" +
    "     </div>";

let htmlStatistics =
    '<div class="col-6">' +
    '                 <div class="card block-color text-white text-opacity-75">' +
    '                     <div class="card-body">' +
    '                         <div class="stats-chart-row">' +
    '                             <div class="stats-chart-row-label"> Critical </div>' +
    '                             <div class="stats-chart-row-value color-critical"><span class="stat-percent"' +
    '                                     tabindex="0">${criticalImpactsPercentage}</span>%</div>' +
    '                             <div class="stats-chart-row-items"><span class="stat-item" tabindex="0">${criticalImpactsCount}</span>' +
    '                                 <span class="stat-item-text" tabindex="0">items</span>' +
    "                             </div>" +
    '                             <div class="stats-chart-row-bar"> <span' +
    '                                     class="stats-chart-row-bar-value color-critical" style="width: ${criticalImpactsPercentage}%;"></span>' +
    "                             </div>" +
    "                         </div>" +
    '                         <div class="stats-chart-row">' +
    '                             <div class="stats-chart-row-label"> Serious </div>' +
    '                             <div class="stats-chart-row-value color-serious"><span class="stat-percent"' +
    '                                     tabindex="0">${seriousImpactsPercentage}</span>%</div>' +
    '                             <div class="stats-chart-row-items"><span class="stat-item" tabindex="0">${seriousImpactsCount}</span>' +
    '                                 <span class="stat-item-text" tabindex="0">items</span>' +
    "                             </div>" +
    '                             <div class="stats-chart-row-bar"> <span' +
    '                                     class="stats-chart-row-bar-value color-serious" style="width: ${seriousImpactsPercentage}%;"></span>' +
    "                             </div>" +
    "                         </div>" +
    '                         <div class="stats-chart-row">' +
    '                             <div class="stats-chart-row-label"> Medium </div>' +
    '                             <div class="stats-chart-row-value color-medium"><span class="stat-percent"' +
    '                                     tabindex="0">${mediumImpactsPercentage}</span>%</div>' +
    '                             <div class="stats-chart-row-items"><span class="stat-item" tabindex="0">${mediumImpactsCount}</span>' +
    '                                 <span class="stat-item-text" tabindex="0">items</span>' +
    "                             </div>" +
    '                             <div class="stats-chart-row-bar"> <span' +
    '                                     class="stats-chart-row-bar-value color-medium" style="width: ${mediumImpactsPercentage}%;"></span>' +
    '                             </div>' +
    "                         </div>" +
    '                         <div class="stats-chart-row"></div>' +
    "                         </div></div></div>";

let htmlNonComplaint =
    '<div class="col-6">' +
    '                 <div class="card block-color text-white text-opacity-75;">' +
    '                     <div class="card-body">' +
    '                         <div class="stats-chart-row">' +
    '                         <div class="h6">${ComplaintTitle}</div>' +
    '                     </div>' +
    '                         <div class="stats-chart-row">' +
    '                         <span class="complaint-text">${ComplaintMessage}</span>' +
    '                     </div>' +
    '                         <div class="stats-chart-row"></div>' +
    '                         <div class="stats-chart-row">' +
    '                         <strong class="text-white text-opacity-75">Errors: ${totalErrors}</strong>' +
    '                     </div>' +
    "                     </div>" +
    "                 </div>" +
    "             </div>";

let htmlAccordion =
    '<div class="accordion" id="accordionPanelsStayOpen${index}">' +
    '                 <div class="${accordionItem}">' +
    '                 <div class="accordion-header" id="heading${index}">' +
    '                 <div class="accordion-button text-white text-opacity-75 ${errorBgColor}" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${index}">' +
    '                     <div class="row col-12 g-2">' +
    '<div class="col-10 text-start">${title}</div>' +
    '                     <div class="col-2">${highImpactErrorCountMsg}</div></div></div></div>' +
    '                 <div id="panelsStayOpen-collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}">' +
    '                 <div class="accordion-body">' +
    '                         <div class="fw-bold mt-3 text-secondary"><h3>${errorType}</h3></div><br>' +
    '                         <div class="fw-bold mt-3 text-secondary">What It Means:</div>' +
    '                         <div class="card-text mt-3">${summary}</div>' +
    '                         <div class="fw-bold mt-3 text-secondary">Why It Matters:</div>' +
    '                         <div class="card-text mt-3">${purpose}</div>' +
    '                         <div class="fw-bold mt-3 text-secondary">How to Fix It:</div>' +
    '                         <div class="card-text mt-3">${actions}</div>' +
    '                         <div class="fw-bold mt-3 text-secondary">Standards and Guidelines:</div>' +
    '                         <div class="card-text mt-3">${guideLineCheckList}</div>' +
    '                         <div class="fw-bold mt-3 text-secondary">Item\'s XPath:</div>' +
    '                         <ul class="mt-3"><small>${xpathlist}</small></ul>' +
    "                 </div></div></div></div>";

let totalCriticalIssuesCount = 0;
let totalMediumIssuesCount = 0;

export const getHtmlReportByGuideLine = async () => {
    let html = [];

    const endDateTime = getDateString("dd-MM-yyyy HH:mm:ss");

    let axeStatsData = wcagResult.axeStatistics;
    let lighthouseStatsData = wcagResult.lighthouseStatistics;
    let axeViolations = await deserializedAxeResults();
    let lightHouseViolations = await deserializedLighthouseResults();
    let allViolations = axeViolations.concat(lightHouseViolations);

    let statsData = axeStatsData.length > 0 ? axeStatsData : lighthouseStatsData;

    htmlHeader = htmlHeader.replaceAll("${statisticsStyles}", getStyles());

    html.push(`<!DOCTYPE html><html>${htmlHeader}<body>`);
    html.push(`<h1 class="mt-4 mb-3"><center>Accessibility Test Run Report</center></h1>` +
        `<div class="container mt-4 bg-light shadow-lg"><div class="container-fluid p-3">` +
        `<div class="text-secondary mb-4">Test Run: ` +
        `${wcagResult.startDateTime} - ${endDateTime}</div>` +
        `${getTotalPagesGuideLine(statsData)}</div></div>` +
        `</div></div>`);

    let pageIndex = 0;

    statsData.forEach((item) => {
        let report = allViolations.filter(c => c.url === item.url);

        let criticalItems = report.filter(c => c.type === "critical");
        let seriousItems = report.filter(c => c.type === "serious");
        let moderateItems = report.filter(c => c.type === "moderate");

        let totalSeriousCount = seriousItems.reduce((sum, item) => sum + (item.elementXPath?.length || 0), 0);
        let totalCriticalCount = criticalItems.reduce((sum, item) => sum + (item.elementXPath?.length || 0), 0);
        let totalModerateCount = moderateItems.reduce((sum, item) => sum + (item.elementXPath?.length || 0), 0);
        let totalErrors = totalSeriousCount + totalCriticalCount;

        let allItemsCount = totalSeriousCount + totalCriticalCount + totalModerateCount;

        html.push(`<div class="container mt-4 bg-light shadow-lg"><div class="container-fluid p-3"><h6 class="text-secondary">` +
            `Page ${pageIndex + 1} - ${item.url}</h6><div class="row mt-3">`);

        const message = `${totalCriticalCount > 0 ? "This page is at risk of accessibility issues." : "This page is not at risk of accessibility issues."}`;

        let newHtmlNonComplaint = htmlNonComplaint
            .replaceAll("${ComplaintTitle}", "CONFORMANCE")
            .replaceAll("${ComplaintMessage}", message);

        html.push(newHtmlNonComplaint.replaceAll("${totalErrors}", totalErrors.toString()));

        let criticalImpactPercentage = (totalCriticalCount / allItemsCount * 100).toFixed(2);
        let seriousImpactPercentage = (totalSeriousCount / allItemsCount * 100).toFixed(2);
        let mediumImpactPercentage = (totalModerateCount / allItemsCount * 100).toFixed(2);

        let htmlStatisticsstring = htmlStatistics
            .replaceAll("${criticalImpactsPercentage}", criticalImpactPercentage)
            .replaceAll("${criticalImpactsCount}", totalCriticalCount.toString())
            .replaceAll("${seriousImpactsPercentage}", seriousImpactPercentage)
            .replaceAll("${seriousImpactsCount}", totalSeriousCount.toString())
            .replaceAll("${mediumImpactsPercentage}", mediumImpactPercentage)
            .replaceAll("${mediumImpactsCount}", totalModerateCount.toString());

        html.push(`${htmlStatisticsstring}</div><br><div id="accordion">`);

        if ((seriousItems.length || 0) > 0) {
            html.push(groupViolationsByGuidLine(seriousItems, pageIndex));
        }

        if ((criticalItems.length || 0) > 0) {
            html.push(groupViolationsByGuidLine(criticalItems, pageIndex));
        }

        if (totalModerateCount > 0) {
            html.push(groupViolationsByGuidLine(moderateItems, pageIndex));
        }

        html.push("</div></div></div>");

        pageIndex++;
    });

    html.push("</html>");
    let htmlValue = getTotalIssuesGuideLine(html.join(''));
    return htmlValue;
}

export const getTotalPagesGuideLine = (jsonStatistics) => {
    const pageCount = jsonStatistics.length;
    htmlTotalIssues = htmlTotalIssues.replaceAll("${TotalPages}", pageCount.toString());
    return htmlTotalIssues;
}

export const getTotalIssuesGuideLine = (html) => {
    return html.replaceAll("${TotalCriticalIssues}", totalCriticalIssuesCount.toString()).replaceAll("${TotalMediumIssues}", totalMediumIssuesCount.toString());
}

export const groupViolationsByGuidLine = (violations, pageIndex) => {
    let tempArr = []

    const groupedByGuideline = new Map();
    violations.forEach(item => {
        item.guidelines.forEach(guideline => {
            const key = guideline.guidelineCode + item.tool;

            if (!groupedByGuideline.has(key)) {
                // Initialize with a deep copy of the item and empty elementXPath
                groupedByGuideline.set(key, {
                    ...item,
                    elementXPath: [...item.elementXPath],
                    guidelines: [guideline] // keep only the relevant guideline
                });
            } else {
                const existing = groupedByGuideline.get(key);

                // Concatenate elementXPath
                existing.elementXPath = existing.elementXPath.concat(item.elementXPath);

                // Optionally merge other properties if needed
                existing.count += item.count;
            }
        });
    });

    groupedByGuideline.forEach((value, key) => {

        const tempHtml = appendErrorsForGuidLines(
            value,
            key,
            pageIndex
        )

        tempArr.push(tempHtml);
    });

    return tempArr.join('');
}

export const appendErrorsForGuidLines = (violation, guideLine, pageIndex) => {

    let tempHtml = '';

    if (violation) {
        const categoryCode = violation.type
        const title = violation.title
        const summary = violation.summary
        const purpose = violation.purpose
        const actions = violation.actions

        let count = violation.elementXPath?.length;

        let errorBgColor = ''
        let impactCategoryMsg = ''
        let accordionItembgColor = "accordion-item";

        switch (categoryCode) {
            case "error":
            case "contrast":
            case "critical":
                impactCategoryMsg = `${count} critical impact`;
                errorBgColor = "bg-danger bg-gradient";
                totalCriticalIssuesCount += count;
                break;
            case "serious":
                impactCategoryMsg = `${count} serious impact`;
                errorBgColor = "bg-danger-light";
                totalCriticalIssuesCount += count;
                accordionItembgColor = "accordion-item custom";
                break;
            case 'moderate':
            case 'alert':
                errorBgColor = 'bg-warning';
                impactCategoryMsg = count + ' medium impact';
                totalMediumIssuesCount += count;
                break;
            default:
                errorBgColor = 'bg-success';
                impactCategoryMsg = count + ' low impact';
                break;
        }

        let elementXpaths = violation.elementXPath?.map((item) => {
            return `<li>${item}</li>`;
        }).join('');

        let guideLinestring = '';

        if (violation.guidelines) {
            guideLinestring = violation.guidelines?.map((item) => {
                return `<a href="${item.guidelineLink}" target="_blank" rel="noopener noreferrer">${item.guidelineLink}</a>`;
            }).join('<br>');
        }
        else { guideLinestring = 'NA'; }

        const navigation = guideLine
            .replaceAll("(", "")
            .replaceAll(")", "")
            .replaceAll(".", "")
            .replaceAll("-", "")
            .replaceAll(" ", "")
            .replaceAll(",", "-")

        let updatedGuideLine = guideLine.replaceAll("Axe", "").replaceAll("Lighthouse", "").trim();
        let accordianTitle = `${violation.tool}: ${updatedGuideLine}`

        let htmlString = htmlAccordion
            .replaceAll("${index}", `${navigation}${categoryCode}_${pageIndex}`)
            .replaceAll("${errorBgColor}", errorBgColor)
            .replaceAll("${title}", accordianTitle)
            .replaceAll("${accordionItem}", accordionItembgColor)
            .replaceAll("${errorType}", title)
            .replaceAll("${summary}", summary)
            .replaceAll("${highImpactErrorCountMsg}", impactCategoryMsg)
            .replaceAll("${purpose}", purpose)
            .replaceAll("${actions}", actions)
            .replaceAll("${guideLineCheckList}", guideLinestring)
            .replaceAll("${xpathlist}", elementXpaths)

        tempHtml = htmlString;
    }

    return tempHtml;
}


export const getGuideLine = (violations) => {
    const guidLineList = new Map();

    violations.forEach(item => {
        const guideLines = item.guidelines;

        if (guideLines) {
            if (guideLines.length <= 0) {
                guidLineList.set("NoGuidLines", "None")
            }
            else {
                guideLines.forEach(guideLine => {
                    guidLineList.set(
                        guideLine.link, `${guideLine.name}`
                    )
                });
            }
        }
    });

    return guidLineList;
}