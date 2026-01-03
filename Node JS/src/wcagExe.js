/* global axe */
import { getDateString } from "./utils.js";
import { wcagResult } from "./global.js";
import axeCore from 'axe-core';
import lighthouse from 'lighthouse'
 
const options = {
   logLevel: 'info',
   output: 'json',
   onlyCategories: ['accessibility']
};
 
export const init = async () => {
   wcagResult.startDateTime = getDateString("dd-MM-yyyy HH:mm:ss")
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
 
      await new Promise(resolve => setTimeout(resolve, 1000))
 
      await collectLightHouseAccessibilityIssues(visitedUrl);
 
      await collectAxeAccessibilityIssues(driver, visitedUrl);
   }
}
 
export const collectLightHouseAccessibilityIssues = async (url) => {
 
   const result = await lighthouse(url, options);
 
   const failingA11yAudits = Object.values(result.lhr.audits)
      .filter(a => a.score !== 1 && a.scoreDisplayMode !== 'notApplicable');
 
   let jsonReportObj = {};
   jsonReportObj[url] = failingA11yAudits;
   wcagResult.lighthouseViolations.push(jsonReportObj);
 
   let statsData = result?.artifacts?.Accessibility;
   let totalElements = statsData?.incomplete.length +
      statsData?.notApplicable.length +
      statsData?.passes.length +
      statsData?.violations.length
 
   let jsonStatisticsObj = {
      allItemCount: totalElements.toString(),
      totalElements: totalElements.toString(),
      pageTitle: url,
      error: 0,
      contrast: 0,
      alert: 0,
      url: url,
   };
 
   jsonStatisticsObj[url] = jsonStatisticsObj;
   wcagResult.lighthouseStatistics.push(jsonStatisticsObj);
}
 
export const collectAxeAccessibilityIssues = async (driver, url) => {
 
   const { source } = axeCore;
   await driver.execute(source);

   let axeOptions = {};
 
   let response = await driver.executeAsync((options, done) => {
      axe.run(options, (err, results) => {
         if (err)
            done(err);
         done(JSON.parse(JSON.stringify(results)))
      });
   }, axeOptions);
 
   let incompleteData = response?.incomplete;
   let violationsData = response?.violations;
   let allViolations = incompleteData.concat(violationsData);
 
   let jsonReportObj = {};
   jsonReportObj[url] = allViolations;
   wcagResult.axeViolations.push(jsonReportObj);
 
   let totalElements = allViolations?.length +
      response?.inapplicable?.length +
      response?.passes.length
 
   let jsonStatisticsObj = {
      allItemCount: totalElements.toString(),
      totalElements: totalElements.toString(),
      pageTitle: url,
      error: 0,
      contrast: 0,
      alert: 0,
      url: url,
   };
 
   jsonStatisticsObj[url] = jsonStatisticsObj;
   wcagResult.axeStatistics.push(jsonStatisticsObj);
}