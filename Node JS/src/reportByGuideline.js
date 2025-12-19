import { getDateString, getStyles, deserializedAxeResults, deserializedStatistics, deserializedLighthouseResults } from "./utils.js";
import { wcagResult } from "./global.js";
import fs from 'fs'

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
    "                     Critical Issues" +
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
    '<div class="col-4">' +
    '                 <div class="card block-color text-white text-opacity-75">' +
    '                     <div class="card-body">' +
    '                         <div class="stats-chart-row">' +
    '                             <div class="stats-chart-row-label"> Critical </div>' +
    '                             <div class="stats-chart-row-value color-high"><span class="stat-percent"' +
    '                                     tabindex="0">${highImpactsPercentage}</span>%</div>' +
    '                             <div class="stats-chart-row-items"><span class="stat-item" tabindex="0">${highImpactsCount}</span>' +
    '                                 <span class="stat-item-text" tabindex="0">items</span>' +
    "                             </div>" +
    '                             <div class="stats-chart-row-bar"> <span' +
    '                                     class="stats-chart-row-bar-value color-high" style="width: ${highImpactsPercentage}%;"></span>' +
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
    "                             </div>" +
    "                         </div>" +
    '                         <div class="stats-chart-row">' +
    '                             <div class="stats-chart-row-label"> Low </div>' +
    '                             <div class="stats-chart-row-value color-low"><span class="stat-percent"' +
    '                                     tabindex="0">${lowImpactsPercentage}</span>%</div>' +
    '                             <div class="stats-chart-row-items"><span class="stat-item" tabindex="0">${lowImpactsCount}</span>' +
    '                                 <span class="stat-item-text" tabindex="0">items</span>' +
    "                             </div>" +
    '                             <div class="stats-chart-row-bar"> <span' +
    '                                     class="stats-chart-row-bar-value color-low" style="width: ${lowImpactsPercentage}%;"></span>' +
    "                             </div></div></div></div></div>";

let htmlTotalErrors =
    '<div class="col-4">' +
    '                 <div class="card block-color text-white text-opacity-75">' +
    '                     <div class="card-body">' +
    '                         <div class="h6">TOTAL</div>' +
    '                         <span class="complaint-text">Total issues.</span>' +
    "                         <br><br>" +
    '                         <strong class="text-white text-opacity-75">${totalElements}</strong>' +
    "                     </div>" +
    "                 </div>" +
    "             </div>";

let htmlNonComplaint =
    '<div class="col-4">' +
    '                 <div class="card block-color text-white text-opacity-75;">' +
    '                     <div class="card-body">' +
    '                         <div class="h6">${ComplaintTitle}</div>' +
    '                         <span class="complaint-text">${ComplaintMessage}</span>' +
    "                         <br><br>" +
    '                         <strong class="text-white text-opacity-75">Errors: ${totalErrors}</strong>' +
    "                     </div>" +
    "                 </div>" +
    "             </div>";

let htmlAccordion =
    '<div class="accordion" id="accordionPanelsStayOpen${index}">' +
    '                 <div class="accordion-item">' +
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
    let axeViolations = deserializedAxeResults();
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

    statsData.forEach((item, index) => {
        let report = allViolations.filter(c => c.url === item.url);

        let errors = report.filter(c => c.type === "error");
        let contrasts = report.filter(c => c.type === "contrast");
        let alerts = report.filter(c => c.type === "alert");

        let seriousItems = report.filter(c => c.type === "serious");
        let criticalItems = report.filter(c => c.type === "critical");
        let moderateItems = report.filter(c => c.type === "moderate");

        let errorCount = errors.length || 0;
        let contrastCount = contrasts.length || 0;
        let alertsCount = alerts.length || 0;
        let allItemsCount = parseInt(item.totalElements);

        let moderateCount = moderateItems.length || 0;
        let axeErrorCount = (seriousItems.length || 0) + (criticalItems.length || 0);
        errorCount += axeErrorCount;
        alertsCount += moderateCount;

        let totalErrors = errorCount + contrastCount;
        allItemsCount += axeErrorCount + moderateCount;

        html.push(`<div class="container mt-4 bg-light shadow-lg"><div class="container-fluid p-3"><h6 class="text-secondary">` +
            `Page ${pageIndex + 1} - ${item.url}</h6><div class="row mt-3">`);

        htmlNonComplaint = totalErrors > 0 ? htmlNonComplaint
            .replaceAll("${ComplaintTitle}", "CONFORMANCE")
            .replaceAll("${ComplaintMessage}", "This page is at risk of an accessibility issues.") :
            htmlNonComplaint
                .replaceAll("${ComplaintTitle}", "CONFORMANCE")
                .replaceAll("${ComplaintMessage}", "This page is not at risk of an accessibility issues.");

        html.push(htmlNonComplaint.replaceAll("${totalErrors}", totalErrors.toString()));
        html.push(htmlTotalErrors.replaceAll("${totalElements}", allItemsCount.toString()));

        let highImpactPercentage = (totalErrors / allItemsCount * 100).toFixed(2);
        let mediumImpactPercentage = (alertsCount / allItemsCount * 100).toFixed(2);
        let lowImpactValue = allItemsCount - totalErrors - alertsCount;
        let lowImpactPercentage = (parseFloat(100.0) - (parseFloat(highImpactPercentage) + parseFloat(mediumImpactPercentage))).toFixed(2);

        let htmlStatisticsstring = htmlStatistics
            .replaceAll("${highImpactsPercentage}", highImpactPercentage)
            .replaceAll("${highImpactsCount}", totalErrors.toString())
            .replaceAll("${mediumImpactsPercentage}", mediumImpactPercentage)
            .replaceAll("${mediumImpactsCount}", alertsCount.toString())
            .replaceAll("${lowImpactsPercentage}", lowImpactPercentage)
            .replaceAll("${lowImpactsCount}", lowImpactValue.toString());

        html.push(`${htmlStatisticsstring}</div><br><div id="accordion">`);

        if (errorCount > 0) {
            html.push(groupViolationsByGuidLine(errors, pageIndex));
        }

        if (contrastCount > 0) {
            html.push(groupViolationsByGuidLine(contrasts, pageIndex));
        }

        if ((seriousItems.length || 0) > 0) {
            html.push(groupViolationsByGuidLine(seriousItems, pageIndex));
        }

        if ((criticalItems.length || 0) > 0) {
            html.push(groupViolationsByGuidLine(criticalItems, pageIndex));
        }

        if (alertsCount > 0) {
            html.push(groupViolationsByGuidLine(alerts, pageIndex));
        }

        if (moderateCount > 0) {
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
            const key = guideline.guidelineCode;

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

        switch (categoryCode) {
            case 'critical':
            case 'serious':
            case 'error':
            case 'contrast':
                errorBgColor = 'bg-danger bg-gradient';
                impactCategoryMsg = count + ' high impact';
                totalCriticalIssuesCount += count;
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

        let accordianTitle = `${violation.tool}: ${guideLine}`

        let htmlString = htmlAccordion
            .replaceAll("${index}", `${navigation}${categoryCode}_${pageIndex}`)
            .replaceAll("${errorBgColor}", errorBgColor)
            .replaceAll("${title}", accordianTitle)
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
