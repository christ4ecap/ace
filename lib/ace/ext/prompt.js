/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var Renderer = require("../virtual_renderer").VirtualRenderer;
var Editor = require("../editor").Editor;
var Range = require("../range").Range;
var event = require("../lib/event");
var lang = require("../lib/lang");
var dom = require("../lib/dom");
var AcePopup = require('../autocomplete/popup').AcePopup;
var $singleLineEditor = require('../autocomplete/popup').$singleLineEditor;
var UndoManager = require("../undomanager").UndoManager;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var OverlayPage = require('./menu_tools/overlay_page').overlayPage;

function prompt(editor, message, options, callback) {
    if (typeof message == "object") {
        return prompt(editor, "", message, options);
    }
    if (options.$type)
       return prompt[options.$type](editor, callback);

    var cmdLine = $singleLineEditor();
    cmdLine.session.setUndoManager(new UndoManager());
    cmdLine.setOption("fontSize", editor.getOption("fontSize"));
    
    var el = dom.buildDom(["div", {class: "ace_prompt_container"}]);
    var overLay = new OverlayPage(editor, el, "0", "0", "0", null);
    el.appendChild(cmdLine.container);

    if (options.$getCompletions) {
        var popup = new AcePopup();
        popup.renderer.setStyle("ace_autocomplete_inline");
        popup.container.style.display = "block";
        
        updateCompletions();
        
        popup.renderer.setScrollMargin(2, 2, 0, 0);
        popup.autoSelect = false;
        popup.setRow(-1);
        popup.on("click", function(e) {
            var data = popup.getData(popup.getRow());
            cmdLine.setValue(data.value || data.name);
            accept();
            e.stop();
        });
    }
    
    if (options.$rules) {
        var tokenizer = new Tokenizer(options.$rules);
        cmdLine.session.bgTokenizer.setTokenizer(tokenizer);
    }
    
    editor.cmdLine = cmdLine;

    el.appendChild(popup.container);

    cmdLine.resize();
    cmdLine.focus();
    cmdLine.setValue(message, 1);
    if (options.selection) {
        cmdLine.selection.setRange({
            start: cmdLine.session.doc.indexToPosition(options.selection[0]),
            end: cmdLine.session.doc.indexToPosition(options.selection[1])
        });
    }
    function accept() {
        options.onAccept && options.onAccept(cmdLine.getValue(), cmdLine);
        overLay.close();

        editor && editor.focus();
        done();
    }

    cmdLine.commands.bindKeys({
        "Enter": accept,
        "Esc|Shift-Esc": function() {
            options.onCancel && options.onCancel(cmdLine.getValue(), cmdLine);
            editor && editor.focus();
            done();
        },
        "Up": function(editor) { popup.goTo("up"); },
        "Down": function(editor) { popup.goTo("down"); },
        "Ctrl-Up|Ctrl-Home": function(editor) { popup.goTo("start"); },
        "Ctrl-Down|Ctrl-End": function(editor) { popup.goTo("end"); },
        "Tab": function(editor) {
            popup.goTo("down");
        },
        "PageUp": function(editor) { popup.gotoPageUp(); },
        "PageDown": function(editor) { popup.gotoPageDown(); }
    });
    function done() {
        overLay.close();
        callback && callback();
    }

    cmdLine.on("input", function() {
        options.onInput && options.onInput();
        updateCompletions();
    });

    function updateCompletions() {
        if (options.getCompletions) {
            var completions = options.getCompletions(cmdLine);
            popup.setData(completions);
            popup.resize(true);
        }
    }
}

prompt.gotoLine = function(editor, callback) {
    function stringifySelection() {
        var a = editor.selection.toJSON();
        if (!Array.isArray(a)) a = [a];
        return a.map(function(r) {
            var cursor = r.isBackwards ? r.start: r.end;
            var anchor = r.isBackwards ? r.end: r.start;
            var row = anchor.row;
            var s = ":" + (row + 1) + ":" + anchor.column;
        
            if (anchor.row == cursor.row) {
                if (anchor.column > cursor.column)
                    s += "->-" + (anchor.column - cursor.column);
                else if (anchor.column < cursor.column)
                    s += "->+" + (cursor.column - anchor.column);
            }
            else {
                s += " "+ (cursor.row + 1) + ":" + cursor.column;
            }

            return s;
        }).join(", ");
    }

    prompt(editor, stringifySelection(), {
        selection: [1, Number.MAX_VALUE],
        onInput: function() {
                
        },
        onAccept: function(value) {
            var currentPos = editor.getCursorPosition();
            value.split(/(\d+|[c:,+-])/).forEach(function() {
            });
            var m = value.replace(/^:/, "").split(":");
            
            editor.gotoLine(parseInt(m[0]), parseInt(m[1]));
        },
        onCancel: function () {
            
        },
        data: [{
                name: "hello" + Date.now()
            }, {
                name: "world" + Date.now()
            }],
        getCompletions: function(editor) {
            this.data.unshift({
                name: editor.getValue() + "" + Date.now()
            })
            return this.data;
        },
        $rules: {
            start: [{
                regex: /\d+/,
                token: "number"
            }, {
                regex: /[:,]/,
                token: "punctuation"
            }, {
                regex: /[+-c]/,
                token: "operator"
            }]
        }
    });
};

prompt.commands = function(editor, callback) {
    prompt(editor, stringifySelection(), {
        selection: [1, Number.MAX_VALUE],
        onAccept: function(value) {
            
        },
        onCancel: function () {
            
        },
        getCompletions: function() {
            
        },
        $rules: {
            start: [{
                regex: /\d+/,
                token: "number"
            }, {
                regex: /[:,]/,
                token: "punctuation"
            }, {
                regex: /[+-c]/,
                token: "operator"
            }]
        }
    });
};

dom.importCssString(".ace_prompt_container {\
    max-width: 600px;\
    margin: 20px auto;\
    padding: 3px;\
    background: white;\
    border-radius: 2px;\
    box-shadow: 0px 2px 4px 2px #b3b3b3;\
}");


exports.prompt = prompt;

});
