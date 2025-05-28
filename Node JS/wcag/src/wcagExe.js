import { getDateString, getJsRules } from "./utils.js";
import { wcagResult } from "./global.js";
import axeCore from 'axe-core';
import { stringify, parse } from "flatted";

export const init = async () => {
    wcagResult.startDateTime = getDateString("dd-MM-yyyy HH:mm:ss")
    wcagResult.jsRuleScript = await getJsRules(process.cwd()+'/dist/wave.min.js');
}

export const analyse = async (driver, pageKey) => {

    let visitedUrl = await driver.getUrl()

    if (pageKey) {
        const pageUniqueKey = pageKey.trim()

        visitedUrl =
            pageUniqueKey.length > 0
                ? visitedUrl + pageUniqueKey
                : visitedUrl
    }

    if (!wcagResult.visitedPageUrls.has(visitedUrl)) {

        wcagResult.visitedPageUrls.set(visitedUrl, await driver.getTitle())

        await driver.setTimeout({ "script": 120000 });

        await driver.execute(wcagResult.jsRuleScript)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await collectAccessibilityIssues(driver,visitedUrl)
        await clearAllIcons(driver);


        const { source } = axeCore;
        await driver.execute(source);
        let axeOptions = {};

        let results = await driver.executeAsync((options, done) => {
            axe.run(options, (err, results) => {
                if (err)
                    done(err);
                done(JSON.parse(JSON.stringify(results)))
            });
        }, axeOptions);

        await collectAxeAccessibilityIssues(visitedUrl, results.violations);
    }
}

export const collectAccessibilityIssues = async (driver, currentUrl) => {
    const jsonReport = await driver.execute(
        "return window.violations();"
    )

    const jsonStatistic = await driver.execute(
        "return window.statistics();"
    )

    let jsonReportObj = {};
    jsonReportObj[currentUrl] = parse(stringify(jsonReport));
    wcagResult.jsonReportViolations.push(jsonReportObj);

    let jsonStatisticsObj = {};
    jsonStatisticsObj[currentUrl] = parse(stringify(jsonStatistic));
    wcagResult.jsonReportStatistics.push(jsonStatisticsObj);
}

export const clearAllIcons = async (driver) => {
    await driver.execute("window.hideAllIcons();")

    var removeScript = "var nodes = document.getElementsByTagName(\"accxtn\");\r\n\r\nfor (var i = 0, len = nodes.length; i != len; ++i) {\r\n    nodes[0].parentNode.removeChild(nodes[0]);\r\n}" +
        "var nodes = document.getElementsByClassName(\"wave5icon\");\r\n\r\nfor (var i = 0, len = nodes.length; i != len; ++i) {\r\n    nodes[0].parentNode.removeChild(nodes[0]);\r\n}" +
        "var element = document.getElementById(\"wave_sidebar_container\");\r\nelement.parentNode.removeChild(element);\r\n" +
        "var element = document.getElementById(\"wave5topbar\");\r\nelement.parentNode.removeChild(element);\r\n" +
        "var element = document.getElementById(\"wave5bottombar\");\r\nelement.parentNode.removeChild(element);\r\n" +
        "var element = document.getElementById(\"wave5_iconbox\");\r\nelement.parentNode.removeChild(element);\r\n";

    await driver.execute(removeScript);
}

export const collectAxeAccessibilityIssues = async (url, reslut) => {
    let jsonReportObj = {};
    jsonReportObj[url] = reslut;
    wcagResult.axeViolations.push(jsonReportObj);
}