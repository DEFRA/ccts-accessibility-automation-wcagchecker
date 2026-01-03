import { format } from "date-fns";
import { wcagResult } from "./global.js";
import { promises as fs } from 'fs';

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
        ".stats-chart-row-value.color-critical {\r\n" +
        " color: #f66\r\n" +
        "}\r\n" +
        ".stats-chart-row-value.color-serious {\r\n" +
        " color: #ff704d;\r\n" +
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
        ".stats-chart-row-bar-value.color-critical {\r\n" +
        " background-color: #f66\r\n" +
        "}\r\n" +
        ".stats-chart-row-bar-value.color-serious {\r\n" +
        " background-color: #ff704d;\r\n" +
        "}\r\n" +
        "\r\n" +
        ".stats-chart-row-bar-value.color-medium {\r\n" +
        " background-color: #eeb943\r\n" +
        "}\r\n" +
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
        "}\r\n" +
        ".bg-danger-light { background-color: #ff704d; }\r\n" +
        ".accordion-item.custom { --bs-accordion-active-bg: #ff704d; --bs-accordion-active-color: #fff; }"
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

export const deserializedAxeResults = async () => {

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
                    actions = node.failureSummary;
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

            let guidelines = [];

            guidelines.push(
                {
                    name: "Axe Violation",
                    guidelineCode: tagsString.join(", "),
                    guidelineLink: item.helpUrl.trim(),
                    guidelineLevel: ''
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
                guidelines: guidelines
            };

            resultData.push(result);
        });
    });

    return resultData;
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
            if (debugData !== undefined && detailsItemList.length > 0) {
                let actions = '';
                let elementXPath = [];
                let guidelines = [];

                guidelines.push(
                    {
                        name: "Lighthouse",
                        guidelineCode: (debugData.tags || [])
                            .filter(tag => tag.startsWith("wcag") || tag.startsWith("cat."))
                            .join(", "),
                        guidelineLink: '',
                        guidelineLevel: ''
                    });

                detailsItemList.map((entry) => {
                    const node = entry.node || {};

                    if (actions === '') {
                        actions = node.explanation;
                    }

                    //sanitize html
                    let xpath = node.snippet.trim()
                        .replaceAll(/(\r\n|\n)/g, '')
                        .replaceAll(/ {2}/g, '')
                        .replaceAll(/&/g, "&amp;")
                        .replaceAll(/</g, "&lt;")
                        .replaceAll(/>/g, "&gt;")
                        .replaceAll(/"/g, "&quot;")
                        .replaceAll(/'/g, "&#039;");

                    elementXPath.push(xpath);
                });

                let resultData = {
                    url: pageUrlKey[0],
                    title: item.id,
                    summary: item.title,
                    purpose: item.description,
                    actions: actions,
                    elementXPath: elementXPath,
                    type: debugData.impact,
                    tool: "Lighthouse",
                    guidelines: guidelines
                };

                resultsData.push(resultData);
            }
        });

    });

    return resultsData;
}