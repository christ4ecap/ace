

export const isDark = false;
export const cssClass = "ace-clouds";
export const cssText = require("./clouds.css.js");

import dom from '../lib/dom.js';
dom.importCssString(exports.cssText, exports.cssClass);
