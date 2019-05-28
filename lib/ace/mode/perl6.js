
"use strict";

import oop from '../lib/oop.js';
import { Mode as TextMode } from './text.js';
import { Perl6HighlightRules } from './perl6_highlight_rules.js';
import { MatchingBraceOutdent } from './matching_brace_outdent.js';
import { FoldMode as CStyleFoldMode } from './folding/cstyle.js';

var Mode = function() {
    this.HighlightRules = Perl6HighlightRules;

    this.$outdent = new MatchingBraceOutdent();
    this.foldingRules = new CStyleFoldMode({start: "^=(begin)\\b", end: "^=(end)\\b"});
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = "#";
    this.blockComment = [
        {start: "=begin", end: "=end", lineStartOnly: true},
        {start: "=item", end: "=end", lineStartOnly: true}
    ];


    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[:]\s*$/);
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

    this.$id = "ace/mode/perl6";
}).call(Mode.prototype);

export { Mode };
