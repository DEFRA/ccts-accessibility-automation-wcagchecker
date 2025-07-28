import { getHtmlReportByCategory } from './reportByCategory.js';
import {getHtmlReportByGuideLine} from './reportByGuideline.js';
import { init, analyse } from './wcagExe.js';
import { getJsonReport } from './jsonReport.js';

export{ init, getHtmlReportByCategory, getHtmlReportByGuideLine, analyse, getJsonReport }