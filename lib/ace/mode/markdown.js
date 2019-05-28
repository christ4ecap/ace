
"use strict";

import oop from '../lib/oop.js';
import { Mode as TextMode } from './text.js';
import { Mode as JavaScriptMode } from './javascript.js';
import { Mode as XmlMode } from './xml.js';
import { Mode as HtmlMode } from './html.js';
import { MarkdownHighlightRules } from './markdown_highlight_rules.js';
import { FoldMode as MarkdownFoldMode } from './folding/markdown.js';

var Mode = function() {
    this.HighlightRules = MarkdownHighlightRules;

    this.createModeDelegates({
        javascript: require("./javascript").Mode,
        html: require("./html").Mode,
        bash: require("./sh").Mode,
        sh: require("./sh").Mode,
        xml: require("./xml").Mode,
        css: require("./css").Mode
    });

    this.foldingRules = new MarkdownFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.blockComment = {start: "<!--", end: "-->"};
    this.$quotes = {'"': '"', "`": "`"};

    this.getNextLineIndent = function(state, line, tab) {
        if (state == "listblock") {
            var match = /^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(line);
            if (!match)
                return "";
            var marker = match[2];
            if (!marker)
                marker = parseInt(match[3], 10) + 1 + ".";
            return match[1] + marker + match[4];
        } else {
            return this.$getIndent(line);
        }
    };
    this.$id = "ace/mode/markdown";
}).call(Mode.prototype);

export { Mode };
