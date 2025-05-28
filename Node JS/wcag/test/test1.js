import fs from 'fs'
import { remote } from 'webdriverio'
import { init, analyse, getHtmlReportByGuideLine, getJsonReport } from '../dist/wcagchecker.js';
// import {init, analyse} from '../src/wcagExe.js'
// import {getHtmlReportByGuideLine} from '../src/reportByGuideline.js'
// import {getJsonReport} from '../src/jsonReport.js'
import path from "path";


(async function example() {

    const browser = await remote({
        logLevel: 'error',
        capabilities: {
            browserName: 'chrome'
        }
    });

    try {

        //call this method before invoking tests 
        await init();

        await browser.url('https://www.gov.uk/government/news/uk-reaches-agreement-on-north-sea-fishing-opportunities-for-2025');
        //call this method for every page redirection
        await analyse(browser, '');

        await browser.url('https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs');
        await analyse(browser, '');

        await browser.url('https://www.gov.uk/control-dog-public');
        await analyse(browser, '');

        await browser.url('https://environment.data.gov.uk/shoreline-planning/coastal-erosion');
        await analyse(browser, '');

    }
    catch(err)
    {
        console.error(err.message);
    } 
    finally {
        browser.closeWindow();

        fs.writeFileSync('accessibility_json_report_latest.json', getJsonReport(), (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })


        fs.writeFileSync('accessibility_guideline_latest.html', getHtmlReportByGuideLine(), (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })

        fs.writeFile('accessibility_guideline.html', getHtmlReportByGuideLine(), (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })
    }
})();