

export const isDark = false;
export const cssClass = "ace-xcode";
export const cssText = require("./xcode.css.js");

import dom from '../lib/dom.js';
dom.importCssString(exports.cssText, exports.cssClass);
