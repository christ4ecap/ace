

import oop from '../lib/oop.js';
import { Mode as TextMode } from './text.js';
import { Mode as HtmlMode } from './html.js';
import { HtmlCompletions } from './html_completions.js';
import { LiquidBehaviour } from './behaviour/liquid.js';
import { LiquidHighlightRules } from './liquid_highlight_rules.js';
import { MatchingBraceOutdent } from './matching_brace_outdent.js';

var Mode = function() {
    this.HighlightRules = LiquidHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new LiquidBehaviour();
    this.$completer = new HtmlCompletions();
};
oop.inherits(Mode, TextMode);

(function() {
    // this.blockComment = {start: "{% comment %}", end: "{% endcomment %}"};
    this.blockComment = {start: "<!--", end: "-->"};
    this.voidElements = new HtmlMode().voidElements;
    
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;
        var endState = tokenizedLine.state;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

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

    this.$id = "ace/mode/liquid";
}).call(Mode.prototype);

export { Mode };
