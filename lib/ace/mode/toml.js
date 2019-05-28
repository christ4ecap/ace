
"use strict";

import oop from '../lib/oop.js';
import { Mode as TextMode } from './text.js';
import { TomlHighlightRules } from './toml_highlight_rules.js';
import { FoldMode } from './folding/ini.js';

var Mode = function() {
    this.HighlightRules = TomlHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "#";
    this.$id = "ace/mode/toml";
}).call(Mode.prototype);

export { Mode };
