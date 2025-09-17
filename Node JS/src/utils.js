import { format } from "date-fns";
import { wcagResult } from "./global.js";
import { promises as fs } from 'fs';
import axios from "axios";

export const getDateString = (dateFormat) => {
    const currentDate = new Date()
    const formattedDate = format(currentDate, dateFormat)
    return formattedDate
}

export const getStyles = () => {
    return (
        ".stats-chart-row {\r\n" +
        " display: block;\r\n" +
        " height: 25px\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-label {\r\n" +
        " font-size: 12px;\r\n" +
        " width: 50%;\r\n" +
        " float: left\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-value {\r\n" +
        " font-size: 12px;\r\n" +
        " float: right;\r\n" +
        " margin-left: 5px\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-value.color-high {\r\n" +
        " color: #f66\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-value.color-medium {\r\n" +
        " color: #eeb943\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-value.color-low {\r\n" +
        " color: #60c888\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-items {\r\n" +
        " font-size: 12px;\r\n" +
        " float: right\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-bar {\r\n" +
        " position: relative;\r\n" +
        " float: left;\r\n" +
        " height: 5px;\r\n" +
        " background-color: #4c608d;\r\n" +
        " width: 100%;\r\n" +
        " margin-bottom: 10px\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-bar-value {\r\n" +
        " position: absolute;\r\n" +
        " top: 0;\r\n" +
        " left: 0;\r\n" +
        " height: 5px\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-bar-value.color-high {\r\n" +
        " background-color: #f66\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-bar-value.color-medium {\r\n" +
        " background-color: #eeb943\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-bar-value.color-low {\r\n" +
        " background-color: #60c888\r\n" +
        "}\r\n" +
        "\r\n" +
        ".block-color {\r\n" +
        " background-color: #334670;\r\n" +
        "}\r\n" +
        "\r\n" +
        ".complaint-text {\r\n" +
        " font-size: 12px;\r\n" +
        "}\r\n" +
        "\r\n" +
        ".light-red{\r\n" +
        " background-color: #FFCCCB;\r\n" +
        "}"
    )
}

export const getJsRules = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
};

export const deserializedAxeResults = () => {

    let resultData = [];

    let jsonObjectAxeViolations = wcagResult.axeViolations;

    jsonObjectAxeViolations.forEach(currentItem => {

        const pageUrlKey = Object.keys(currentItem);
        const jsonReport = currentItem[pageUrlKey];


        jsonReport.forEach(item => {

            let actions = '';
            let elementXPath = [];
            let tagsString = (item.tags || []).filter((tag) => tag.startsWith("wcag") || tag.startsWith('cat.'));

            item.nodes.forEach(node => {

                if (actions === '') {
                    actions = item.failureSummary;
                }

                //sanitize html
                let xpath = node.html.trim()
                    .replaceAll(/(\r\n|\n)/g, '')
                    .replaceAll(/ {2}/g, '')
                    .replaceAll(/&/g, "&amp;")
                    .replaceAll(/</g, "&lt;")
                    .replaceAll(/>/g, "&gt;")
                    .replaceAll(/"/g, "&quot;")
                    .replaceAll(/'/g, "&#039;");

                elementXPath.push(xpath);
            });

            let result = {
                url: pageUrlKey[0],
                title: item.id,
                summary: item.description,
                purpose: item.help,
                actions: actions,
                elementXPath: elementXPath,
                type: item.impact,
                tool: "Axe",
                guidelines: [{
                    name: "Axe Violation",
                    guidelineCode: '',
                    guidelineLink: item.helpUrl.trim(),
                    guidelineLevel: tagsString
                }]
            };

            resultData.push(result);
        });
    });

    return resultData;
}

export const deserializedWaveResults = async () => {

    const resultsData = [];

    for (const item of wcagResult.waveViolations) {
        for (const jsonReportKey of Object.keys(item)) {
            const jsonReport = item[jsonReportKey];

            for (const [categoryKey, categoryValue] of Object.entries(jsonReport)) {
                if (categoryKey !== 'feature' && categoryKey !== 'structure' && categoryKey !== 'aria') {
                    for (const [itemKey, itemValue] of Object.entries(categoryValue.items)) {
                        try {
                            let responseDetails = await axios.get(`https://wave.webaim.org/api/docs?id=${itemKey}`);
                            let responseDetailsData = responseDetails.data;

                            const result = {
                                url: jsonReportKey,
                                title: responseDetailsData.title ?? ''.trim().replace(/\r\n/g, ''),
                                summary: responseDetailsData.summary ?? ''.trim().replace(/\r\n/g, ''),
                                purpose: responseDetailsData.purpose ?? ''.trim().replace(/\r\n/g, ''),
                                actions: responseDetailsData.actions ?? ''.trim().replace(/\r\n/g, ''),
                                elementXPath: itemValue.xpaths,
                                type: responseDetailsData.type,
                                count: itemValue.count,
                                guidelines: responseDetailsData.guidelines,
                                tool: "Wave"
                            };

                            resultsData.push(result);
                        } catch (error) {
                            console.error(`Error fetching data for ${itemKey}:`, error);
                        }
                    }
                }
            }
        }
    }

    return resultsData;
}

export const deserializedStatistics = () => {
    const statsData = [];

    wcagResult.waveStatistics.forEach((item) => {
        const jsonStatKey = Object.keys(item);
        const jsonStat = item[jsonStatKey];
        const stat = {
            allItemCount: jsonStat.allitemcount.toString(),
            totalElements: jsonStat.totalelements.toString(),
            pageTitle: jsonStat.pagetitle.toString(),
            error: 0,
            contrast: 0,
            alert: 0,
            url: jsonStatKey[0],
        };
        statsData.push(stat);
    });

    return statsData;
}

export const deserializedLighthouseResults = async () => {

    const resultsData = [];

    wcagResult.lighthouseViolations.forEach(data => {

        const pageUrlKey = Object.keys(data);
        const items = data[pageUrlKey];

        items.forEach((item) => {
            const debugData = item.details?.debugData || {};
            const detailsItemList = item.details?.items || [];

            let actions = '';
            let elementXPath = [];
            let guidelines = [];

            guidelines.push(
                {
                    name: "Lighthouse",
                    guidelineCode: '',
                    guidelineLink: '',
                    guidelineLevel: (debugData.tags || []).filter((tag) => tag.startsWith("wcag") || tag.startsWith('cat.'))
                });

            detailsItemList.map((entry) => {
                const node = entry.node || {};

                if (actions === '') {
                    actions = node.explanation;
                }

                elementXPath.push(node.snippet);
            });

            const resultData = {
                url: pageUrlKey,
                title: item.id,
                summary: item.title,
                purpose: item.description,
                actions: actions,
                elementXPath: elementXPath,
                type: debugData.impact,
                guidelines: guidelines,
                count: elementXPath.length,
                tool: "Lighthouse"
            };

            resultsData.push(resultData);
        });

    });

    return resultsData;
}