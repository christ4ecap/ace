

export const isDark = true;
export const cssClass = "ace-chaos";
export const cssText = require("./chaos.css.js");

import dom from '../lib/dom.js';
dom.importCssString(exports.cssText, exports.cssClass);
