
"use strict";

import oop from '../lib/oop.js';
import { Mode as TextMode } from './text.js';
import { JackHighlightRules as HighlightRules } from './jack_highlight_rules.js';
import { MatchingBraceOutdent } from './matching_brace_outdent.js';
import { CstyleBehaviour } from './behaviour/cstyle.js';
import { FoldMode as CStyleFoldMode } from './folding/cstyle.js';

var Mode = function() {
    this.HighlightRules = HighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "--";

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };


    this.$id = "ace/mode/jack";
}).call(Mode.prototype);

export { Mode };
