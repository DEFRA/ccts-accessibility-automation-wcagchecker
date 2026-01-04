import { getDateString, getStyles, deserializedAxeResults, deserializedLighthouseResults } from "./utils.js";
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
    "                     Critical & Serious Issues" +
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
    '                         <strong class="text-white text-opacity-75">Critical & Serious errors: ${totalErrors}</strong>' +
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

export const getHtmlReportByCategory = async () => {
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
        `${getTotalPagesHtml(statsData)}</div></div>` +
        `</div></div>`);

    let pageIndex = 0;

    statsData.forEach(item => {
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

        const message = `${totalErrors > 0 ? "This page is at risk of accessibility issues." : "This page is not at risk of accessibility issues. However addressing medium findings is advisable."}`;

        let newHtmlNonComplaint = htmlNonComplaint
            .replaceAll("${ComplaintTitle}", "Conformance")
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
            html.push(groupJsonByIssueType(seriousItems, pageIndex));
        }

        if ((criticalItems.length || 0) > 0) {
            html.push(groupJsonByIssueType(criticalItems, pageIndex));
        }

        if (totalModerateCount > 0) {
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
        const key = item.title+item.tool;

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
    let accordionItembgColor="accordion-item";

    switch (item.type) {
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
            return `${item.guidelineCode}   <a href="${item.guidelineLink}" target="_blank" rel="noopener noreferrer">${item.guidelineLink}</a>`;
        }).join('<br>');
    }
    else { guideLinestring = 'NA'; }

    const navigation = filterValue.replaceAll(/[().\-,\s]/g, "");

    const title = item.title.replaceAll(/[().\-,\s]/g, "");
    let titleDisplay = `${item.tool}: ${item.title}`;

    const htmlString = htmlAccordion.replaceAll("${index}", `${navigation}_${item.type}_${title}_${pageIndex}`)
        .replaceAll("${title}", titleDisplay)
        .replaceAll("${errorType}", item.title)
        .replaceAll("${accordionItem}", accordionItembgColor)
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