

if (typeof process !== "undefined") {
    }
"use strict";

import { EditSession } from '../edit_session.js';
import { Mode as AdaMode } from './ada.js';
import assert from '../test/assertions.js';

export default {
    setUp : function() {
        this.mode = new AdaMode();
    },

    "test: auto outdent after 'begin' and 'end'": function() {
        assert.ok(this.mode.checkOutdent("start", "        begi", "n"));
        assert.ok(this.mode.checkOutdent("start", "        en", "d"));
    },

    "test: auto outdent" : function() {
        var session = new EditSession([
            "procedure Pouet is",
            "    begin"
        ]);
        this.mode.autoOutdent("start", session, 1);
        assert.equal("begin", session.getLine(1));
    }
};

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
