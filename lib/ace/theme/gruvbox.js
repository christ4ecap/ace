

export const isDark = true;
export const cssClass = "ace-gruvbox";
export const cssText = require("./gruvbox.css.js");

import dom from '../lib/dom.js';
dom.importCssString(exports.cssText, exports.cssClass);
