import { getDateString } from "./utils.js";
import { wcagResult } from "./global.js";
import axeCore from 'axe-core';
import { stringify, parse } from "flatted";
import lighthouse from 'lighthouse'
import axios from 'axios';
import chromeRemoteInterface from 'chrome-remote-interface';

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

      //await collectWaveAccessibilityIssues(visitedUrl);

      await collectLightHouseAccessibilityIssues(visitedUrl);

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

export const collectLightHouseAccessibilityIssues = async (currentUrl) => {

   const result = await lighthouse(currentUrl, options);
   const auditsDetails = Object.values(result.lhr.audits).filter(audit => audit.score !== 1 && audit.details?.items);

   let jsonReportObj = {};
   jsonReportObj[currentUrl] = auditsDetails;
   wcagResult.lighthouseViolations.push(jsonReportObj);
}

export const collectWaveAccessibilityIssues = async (currentUrl) => {

   //const response = await axios.get(`https://wave.webaim.org/api/request?key=s1Xe9MDR5808&reporttype=3&url==${currentUrl}`);

   const response = `{
   "status":{
      "success":true,
      "httpstatuscode":200
   },
   "statistics":{
      "pagetitle":"Google",
      "pageurl":"https://google.com/",
      "time":1.27,
      "creditsremaining":1487,
      "allitemcount":20,
      "totalelements":186,
      "waveurl":"https://wave.webaim.org/report?url=https://google.com/"
   },
   "categories":{
      "error":{
         "description":"Errors",
         "count":4,
         "items":{
            "language_missing":{
               "id":"language_missing",
               "description":"Document language missing",
               "count":1,
               "xpaths":[
                  "#"
               ]
            },
            "alt_spacer_missing":{
               "id":"alt_spacer_missing",
               "description":"Spacer image missing alternative text",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/CENTER[1]\/SPAN[1]\/DIV[1]\/DIV[1]\/TABLE[1]\/TBODY[1]\/TR[2]\/TD[1]\/IMG[1]"
               ]
            },
            "link_empty":{
               "id":"link_empty",
               "description":"Empty link",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[2]\/OL[1]\/LI[3]\/A[1]"
               ]
            },
            "label_missing":{
               "id":"label_missing",
               "description":"Missing form label",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/TEXTAREA[1]"
               ]
            }
         }
      },
      "contrast":{
         "description":"Contrast Errors",
         "count":2,
         "items":{
            "contrast":{
               "id":"contrast",
               "description":"Very Low Contrast",
               "count":2,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[1]\/OL[1]\/LI[1]\/A[1]",
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[1]\/OL[1]\/LI[2]\/A[1]"
               ],
                "contrastdata":[
                  [
                    2.48,
                    "#9a9aff",
                    "#ffffff",
                    false
                  ],
                  [
                    2.81,
                    "#9a9a9a",
                    "#ffffff",
                    true
                  ]
                ]
            }
         }
      },
      "alert":{
         "description":"Alerts",
         "count":5,
         "items":{
            "h1_missing":{
               "id":"h1_missing",
               "description":"Missing first level heading",
               "count":1,
               "xpaths":[
                  "#"
               ]
            },
            "title_redundant":{
               "id":"title_redundant",
               "description":"Redundant title text",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/CENTER[1]\/DIV[1]\/A[1]\/IMG[1]"
               ]
            },
            "label_title":{
               "id":"label_title",
               "description":"Unlabeled form element with title",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/CENTER[1]\/FORM[1]\/TABLE[1]\/TBODY[1]\/TR[1]\/TD[2]\/DIV[1]\/INPUT[1]"
               ]
            },
            "link_suspicious":{
               "id":"link_suspicious",
               "description":"Suspicious link text",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[1]\/OL[1]\/LI[9]\/A[1]"
               ]
            },
            "heading_skipped":{
               "id":"heading_skipped",
               "description":"Skipped heading level",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[2]\/H2[1]"
               ]
            }
         }
      },
      "feature":{
         "description":"Features",
         "count":1,
         "items":{
            "alt_link":{
               "id":"alt_link",
               "description":"Linked image with alternative text",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/CENTER[1]\/DIV[1]\/A[1]\/IMG[1]"
               ]
            }
         }
      },
      "structure":{
         "description":"Structural Elements",
         "count":6,
         "items":{
            "table_layout":{
               "id":"table_layout",
               "description":"Layout table",
               "count":3,
               "xpaths":[
                  "\/BODY[1]\/CENTER[1]\/FORM[1]\/TABLE[1]\/TBODY[1]\/TR[1]\/TD[1]",
                  "\/BODY[1]\/CENTER[1]\/SPAN[1]\/DIV[1]\/DIV[1]\/TABLE[1]\/TBODY[1]\/TR[1]\/TD[1]",
                  "\/BODY[1]\/TABLE[1]\/TBODY[1]\/TR[1]\/TD[1]"
               ]
            },
            "ol":{
               "id":"ol",
               "description":"Ordered list",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[1]\/OL[1]\/LI[1]"
               ]
            },
            "h2":{
               "id":"h2",
               "description":"Heading level 2",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[2]\/H2[1]"
               ]
            },
            "iframe":{
               "id":"iframe",
               "description":"Inline Frame",
               "count":1,
               "xpaths":[
                  "\/BODY[1]\/IFRAME[1]"
               ]
            }
         }
      },
      "aria":{
         "description":"ARIA",
         "count":4,
         "items":{
            "aria":{
               "id":"aria",
               "description":"ARIA",
               "count":4,
               "xpaths":[
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[1]\/OL[1]\/LI[9]\/A[1]",
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[1]\/OL[1]\/LI[9]\/DIV[1]",
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[2]\/OL[1]\/LI[3]\/A[1]",
                  "\/BODY[1]\/DIV[1]\/DIV[1]\/DIV[1]\/DIV[2]\/OL[1]\/LI[3]\/DIV[1]"
               ]
            }
         }
      }
   }
}`;

   let jsonReportObj = {};
   jsonReportObj[currentUrl] = JSON.parse(response)?.categories;
   wcagResult.waveViolations.push(jsonReportObj);

   let jsonStatisticsObj = {};
   jsonStatisticsObj[currentUrl] = JSON.parse(response)?.statistics;
   wcagResult.waveStatistics.push(jsonStatisticsObj);
}

export const collectAxeAccessibilityIssues = async (url, reslut) => {
   let jsonReportObj = {};
   jsonReportObj[url] = reslut;
   wcagResult.axeViolations.push(jsonReportObj);
}