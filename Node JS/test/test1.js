import fs from 'fs'
import { remote } from 'webdriverio'
//import { init, analyse, getHtmlReportByGuideLine, getJsonReport } from '../dist/wcagchecker.js';
import { init, analyse } from '../src/wcagExe.js'
import { getHtmlReportByGuideLine } from '../src/reportByGuideline.js'
import { getHtmlReportByCategory } from '../src/reportByCategory.js';
//import {getJsonReport} from '../src/jsonReport.js'

// wdio.conf.js
// beforeCommand: function (commandName, args) {
//     if (commandName === 'url' || commandName === 'navigateTo') {
//         const target = args[0]
//         console.log('➡️ Navigation command:', target)
//         await analyse(browser, '');
//     }
// }


(async function example() {
    const browser = await remote({
        logLevel: 'error',
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--disable-gpu', '--remote-debugging-port=9222'] // optional for Lighthouse
            }
        }
    });

    try {

        //call this method before invoking tests 
        await init();

        await browser.url('https://environment.data.gov.uk/shoreline-planning/coastal-erosion');
        await analyse(browser, '');

        await browser.url('https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs');
        await analyse(browser, '');

        await browser.url('https://planthealthportal.defra.gov.uk/');
        await analyse(browser, '');

    }
    catch (err) {
        console.error(err.message);
    }
    finally {
        await browser.deleteSession();

        // fs.writeFileSync('accessibility_json_report_latest.json', getJsonReport(), (err) => {

        //     // In case of a error throw err.
        //     if (err) throw err;
        // })

        fs.writeFileSync('accessibility_category_latest.html', await getHtmlReportByCategory(), (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })

        fs.writeFileSync('accessibility_guideline_latest.html', await getHtmlReportByGuideLine(), (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })
    }
})();