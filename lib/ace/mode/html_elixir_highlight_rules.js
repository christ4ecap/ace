
"use strict";

import oop from '../lib/oop.js';
import { HtmlHighlightRules } from './html_highlight_rules.js';
import { ElixirHighlightRules } from './elixir_highlight_rules.js';

var HtmlElixirHighlightRules = function() {
    HtmlHighlightRules.call(this);

    var startRules = [
        {
            regex: "<%%|%%>",
            token: "constant.language.escape"
        }, {
            token : "comment.start.eex",
            regex : "<%#",
            push  : [{
                token : "comment.end.eex",
                regex: "%>",
                next: "pop",
                defaultToken:"comment"
            }]
        }, {
            token : "support.elixir_tag",
            regex : "<%+(?!>)[-=]?",
            push  : "elixir-start"
        }
    ];

    var endRules = [
        {
            token : "support.elixir_tag",
            regex : "%>",
            next  : "pop"
        }, {
            token: "comment",
            regex: "#(?:[^%]|%[^>])*"
        }
    ];

    for (var key in this.$rules)
        this.$rules[key].unshift.apply(this.$rules[key], startRules);

    this.embedRules(ElixirHighlightRules, "elixir-", endRules, ["start"]);

    this.normalizeRules();
};


oop.inherits(HtmlElixirHighlightRules, HtmlHighlightRules);

export { HtmlElixirHighlightRules };
