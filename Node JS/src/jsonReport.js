import { deserializedAxeResults, deserializedStatistics, deserializedWaveResults } from "./utils.js";

export const getJsonReport = () => {
    try {

        let statsData = deserializedStatistics();
        let waveViolations = deserializedWaveResults();
        let axeViolations = deserializedAxeResults();
        let allViolations = waveViolations.concat(axeViolations);

        let updatedSummary = includeAxeStatistics(statsData, axeViolations);
        let overView = createOverViewJson(updatedSummary);
        const data = createJsonWithSummaryAndDetails(overView, updatedSummary, allViolations);

        return JSON.stringify(data);

    } catch (error) {
        console.error('Error creating JSON:', error);
        throw error;
    }
};

export const createJsonWithSummaryAndDetails = (overViewData, statistics, violations) => {
    return {
        overview: overViewData,
        summary: statistics,
        details: violations,
    };
};


export const includeAxeStatistics = (waveStatsData, axeViolations) => {

    const updatedStatistics = [];

    waveStatsData.forEach((item) => {
        let report = axeViolations.filter(c => c.URL === item.URL);

        let errorCount = parseInt(item.Error);
        let contrastCount = parseInt(item.Contrast);
        let alertsCount = parseInt(item.Alert);
        let allItemsCount = parseInt(item.AllItemCount);

        let seriousItems = (report.filter(c => c.Type === "serious")).length || 0;
        let criticalItems = (report.filter(c => c.Type === "critical")).length || 0;
        let moderateCount = (report.filter(c => c.Type === "moderate")).length || 0;

        let totalAllItems = allItemsCount + seriousItems + moderateCount;

        updatedStatistics.push({
            allItemsCount: totalAllItems,
            totalElements: item.TotalElements,
            pageTitle: item.PageTitle,
            critical: errorCount + contrastCount + criticalItems + seriousItems,
            medium: alertsCount + moderateCount,
            low: totalAllItems - (errorCount + contrastCount + criticalItems + seriousItems + alertsCount + moderateCount),
            url: item.URL
        });
    })

    return updatedStatistics;
}

export const createOverViewJson = (statistics) => {

    let totalCritical = 0;
    let totalMedium = 0;
    let totalLow = 0;
    let totalPages=0;
    let overViewList = [];

    statistics.forEach((item) => {
        let errorCount = parseInt(item.critical);
        let medium = parseInt(item.medium);
        let low = parseInt(item.low);

        totalCritical += errorCount;
        totalMedium += medium;
        totalLow += low;
        totalPages+=1;
    })

    overViewList.push({
        totalPages:totalPages,
        critical: totalCritical,
        medium: totalMedium,
        low: totalLow
    });

    return overViewList;
}