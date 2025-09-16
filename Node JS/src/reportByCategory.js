import { getDateString, getStyles, deserializedAxeResults, deserializedStatistics, deserializedWaveResults } from "./utils.js";
import { wcagResult } from "./global.js";

let totalCriticalIssuesCount = 0;
let totalMediumIssuesCount = 0;

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

export const getHtmlReportByCategory = async () => {
    let html = [];
    const endDateTime = getDateString("dd-MM-yyyy HH:mm:ss");
    let statsData = deserializedStatistics();
    let waveViolations = await deserializedWaveResults();
    //let axeViolations = deserializedAxeResults();
    let axeViolations = [];
    let allViolations = waveViolations.concat(axeViolations);

    htmlHeader = htmlHeader.replaceAll("${statisticsStyles}", getStyles());

    html.push(`<!DOCTYPE html><html>${htmlHeader}<body>`);
    html.push(`<h1 class="mt-4 mb-3"><center>Accessibility Test Run Report</center></h1>` +
        `<div class="container mt-4 bg-light shadow-lg"><div class="container-fluid p-3">` +
        `<div class="text-secondary mb-4">Test Run: ` +
        `${wcagResult.startDateTime} - ${endDateTime}</div>` +
        `${getTotalPagesHtml(statsData)}</div></div>` +
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
            `Page ${pageIndex + 1} - ${item.URL}</h6><div class="row mt-3">`);

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
            html.push(groupJsonByIssueType(errors, pageIndex));
        }

        if (contrastCount > 0) {
            html.push(groupJsonByIssueType(contrasts, pageIndex));
        }

        if ((seriousItems.length || 0) > 0) {
            html.push(groupJsonByIssueType(seriousItems, pageIndex));
        }

        if ((criticalItems.length || 0) > 0) {
            html.push(groupJsonByIssueType(criticalItems, pageIndex));
        }

        if (alertsCount > 0) {
            html.push(groupJsonByIssueType(alerts, pageIndex));
        }

        if (moderateCount > 0) {
            html.push(groupJsonByIssueType(moderateItems, pageIndex));
        }

        html.push("</div></div></div>");
        pageIndex++;
    });

    html.push("</html>");
    let htmlValue = getTotalIssuesHtml(html.join(''));
    return htmlValue;
}


export const getTotalIssuesHtml = (html) => {
    return html.replaceAll("${TotalCriticalIssues}", totalCriticalIssuesCount.toString()).replaceAll("${TotalMediumIssues}", totalMediumIssuesCount.toString());
}

export const getTotalPagesHtml = (jsonStatistics) => {
    const pageCount = jsonStatistics.length;
    htmlTotalIssues = htmlTotalIssues.replaceAll("${TotalPages}", pageCount.toString());
    return htmlTotalIssues;
}

export const groupJsonByIssueType = (violations, pageIndex) => {
    
    let tempArr = [];

    const groupedByTitle = new Map();

    violations.forEach(item => {
        const key = item.title;

        if (!groupedByTitle.has(key)) {
            // Clone the item and initialize elementXPath and guidelines
            groupedByTitle.set(key, {
                ...item,
                elementXPath: [...item.elementXPath],
                guidelines: [...item.guidelines],
                count: item.count
            });
        } else {
            const existing = groupedByTitle.get(key);

            // Merge elementXPath
            existing.elementXPath = existing.elementXPath.concat(item.elementXPath);

            // Merge guidelines, avoiding duplicates
            item.guidelines.forEach(g => {
                if (!existing.guidelines.some(existingG => existingG.name === g.name)) {
                    existing.guidelines.push(g);
                }
            });

            // Update count
            existing.count += item.count;
        }
    });

    groupedByTitle.forEach((value, key) => {

        const tempHtml = appendErrorsForIssueType(
            value,
            key,
            pageIndex
        )

        tempArr.push(tempHtml);
    });

    return tempArr.join('');
}

export const appendErrorsForIssueType = (item, filterValue, pageIndex) => {
    let tempHtml = [];
    let count = item.elementXPath?.length;
    let impactCategoryMsg = "";
    let errorBgColor = "";

    switch (item.type) {
        case "error":
        case "contrast":
        case "critical":
        case "serious":
            impactCategoryMsg = `${count} high impact`;
            errorBgColor = "bg-danger bg-gradient";
            totalCriticalIssuesCount += count;
            break;
        case "alert":
        case "moderate":
            impactCategoryMsg = `${count} medium impact`;
            errorBgColor = "bg-warning";
            totalMediumIssuesCount += count;
            break;
        default:
            impactCategoryMsg = `${count} low impact`;
            errorBgColor = "bg-success";
            break;
    }

    let guideLinestring = "";

    let elementXpaths = item.elementXPath?.map((item) => {
        return `<li>${item}</li>`;
    }).join('');

    if (item.guidelines) {
        guideLinestring = item.guidelines?.map((item) => {
            return `<a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.link}</a>`;
        }).join('<br>');
    }
    else { guideLinestring = 'NA'; }

    const navigation = filterValue.replaceAll(/[().\-,\s]/g, "");

    const title = item.title.replaceAll(/[().\-,\s]/g, "");
    let titleDisplay = item.title;

    if (item.Tool && item.Tool === "Axe") {
        titleDisplay = `Axe Violation: ${item.Title}`;
    }

    const htmlString = htmlAccordion.replaceAll("${index}", `${navigation}_${item.type}_${title}_${pageIndex}`)
        .replaceAll("${title}", titleDisplay)
        .replaceAll("${errorType}", item.title)
        .replaceAll("${errorBgColor}", errorBgColor)
        .replaceAll("${highImpactErrorCountMsg}", impactCategoryMsg)
        .replaceAll("${summary}", item.summary)
        .replaceAll("${purpose}", item.purpose)
        .replaceAll("${actions}", item.actions)
        .replaceAll("${guideLineCheckList}", guideLinestring)
        .replaceAll("${xpathlist}", elementXpaths);

    tempHtml.push(htmlString);
    return tempHtml.join('');
}