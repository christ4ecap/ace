
"use strict";

import oop from '../lib/oop.js';
import { Mode as ShMode } from './sh.js';
import { DockerfileHighlightRules } from './dockerfile_highlight_rules.js';
import { FoldMode as CStyleFoldMode } from './folding/cstyle.js';

var Mode = function() {
    ShMode.call(this);
    
    this.HighlightRules = DockerfileHighlightRules;
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, ShMode);

(function() {
    this.$id = "ace/mode/dockerfile";
}).call(Mode.prototype);

export { Mode };
