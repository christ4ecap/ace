

export const isDark = false;
export const cssClass = "ace-iplastic";
export const cssText = require("./iplastic.css.js");

import dom from '../lib/dom.js';
dom.importCssString(exports.cssText, exports.cssClass);
