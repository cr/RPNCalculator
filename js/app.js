/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

// workaround for false WebStorm warnings
var RPN = window.RPN;
var Stack = window.Stack;
var Buffer = window.Buffer;

// switch math.js to 'bignumber' mode
math.config({
    number: 'bignumber',
    precision: 64
});

// FIXME: following two functions should be Keypad methods, but
// moved here because of scoping issues as keymap 'call' references
var setinv = function () {
    Keypad.inv = true;
    Keypad.loadKeymap("inverse");
};

var setnorm = function () {
    Keypad.inv = true;
    Keypad.loadKeymap("normal");
};

var Keypad = {

    inv: false,

    init: function () {
        this.buildMatrix("function_panel", 5, 4);
        this.buildMatrix("number_panel", 5, 4);
    },

    loadKeymap: function (type) {
        switch (type) {
            case "inverse":
                // FIXME: this hackish way of overwriting non-invs
                for (var i = 0; i < this.keymap.length; i++) {
                    var k = this.keymap[i];
                    var td = this.findParentTd(k.pad, k.pos[0], k.pos[1]);
                    td.textContent = k.label;
                    if (k.inv) {
                        td.className = "invkey";
                    } else {
                        td.className = "normkey";
                    }
                }
                break;
            default:
                for (var j = 0; j < this.keymap.length; j++) {
                    var kk = this.keymap[j];
                    if (!kk.inv) {
                        var tdd = this.findParentTd(kk.pad, kk.pos[0], kk.pos[1]);
                        tdd.textContent = kk.label;
                        tdd.className = "normkey";
                    }
                }
        }
    },

    buildMatrix: function (div_id, width, height) {
        var div = document.getElementById(div_id);
        var table = document.createElement("table");
        table.className = "keyboard";
        table.style.width = "100%";
        table.style.height = "100%";
        var tbody = document.createElement("tbody");

        for (var y = 0; y < height; y++) {
            var tr = document.createElement("tr");
            for (var x = 0; x < width; x++) {
                var td = document.createElement("td");
                td.textContent = x + ":" + y;
                td.style.width = "calc(100% / " + width + ")";
                td.style.maxWidth = "calc(100% / " + width + ")";
                td.style.height = "calc(100% / " + height + ")";
                td.style.maxHeight = "calc(100% / " + height + ")";
                //td.addEventListener("click", pushButton);
                tr.appendChild(td);
                if (x == 0 && y == 1 && div_id == "number_panel") // FIXME: move logic to loadKeymap()
                    td.rowSpan = 3;
                if (x == 0 && y == 2 && div_id == "number_panel")
                    td.style.display = "none";
                if (x == 0 && y == 3 && div_id == "number_panel")
                    td.style.display = "none";
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        div.appendChild(table);
    },

    keymap: [
        {label: "0", pad: "number_panel", pos: [1, 3], call: RPN.append},
        {label: "1", pad: "number_panel", pos: [1, 2], call: RPN.append},
        {label: "2", pad: "number_panel", pos: [2, 2], call: RPN.append},
        {label: "3", pad: "number_panel", pos: [3, 2], call: RPN.append},
        {label: "4", pad: "number_panel", pos: [1, 1], call: RPN.append},
        {label: "5", pad: "number_panel", pos: [2, 1], call: RPN.append},
        {label: "6", pad: "number_panel", pos: [3, 1], call: RPN.append},
        {label: "7", pad: "number_panel", pos: [1, 0], call: RPN.append},
        {label: "8", pad: "number_panel", pos: [2, 0], call: RPN.append},
        {label: "9", pad: "number_panel", pos: [3, 0], call: RPN.append},
        {label: "+", pad: "number_panel", pos: [4, 3], call: RPN.add, dump: true},
        {label: "−", pad: "number_panel", pos: [4, 2], call: RPN.sub, dump: true},
        {label: "×", pad: "number_panel", pos: [4, 1], call: RPN.mul, dump: true},
        {label: "÷", pad: "number_panel", pos: [4, 0], call: RPN.div, dump: true},
        {label: "E", pad: "number_panel", pos: [0, 0], call: RPN.append},
        {label: "±", pad: "number_panel", pos: [3, 3], call: RPN.append},
        {label: ".", pad: "number_panel", pos: [2, 3], call: RPN.append},
        {label: "↵", pad: "number_panel", pos: [0, 1], call: RPN.enter, rowspan: 3}, // FIXME: rowspan currently hardcoded
        {label: "SIN", pad: "function_panel", pos: [0, 2], call: RPN.sin, dump: true},
        {label: "ASIN", pad: "function_panel", pos: [0, 2], call: RPN.asin, dump: true, inv: true},
        {label: "COS", pad: "function_panel", pos: [1, 2], call: RPN.cos, dump: true},
        {label: "ACOS", pad: "function_panel", pos: [1, 2], call: RPN.acos, dump: true, inv: true},
        {label: "TAN", pad: "function_panel", pos: [2, 2], call: RPN.tan, dump: true},
        {label: "ATAN", pad: "function_panel", pos: [2, 2], call: RPN.atan, dump: true, inv: true},
        {label: "√x", pad: "function_panel", pos: [3, 3], call: RPN.sqrt, dump: true},
        {label: "x²", pad: "function_panel", pos: [3, 3], call: RPN.square, dump: true, inv: true},
        {label: "1/x", pad: "function_panel", pos: [4, 3], call: RPN.recip, dump: true},
        {label: "eˣ", pad: "function_panel", pos: [0, 3], call: RPN.exp, dump: true},
        {label: "ln", pad: "function_panel", pos: [0, 3], call: RPN.ln, dump: true, inv: true},
        {label: "10ˣ", pad: "function_panel", pos: [1, 3], call: RPN.exp10, dump: true},
        {label: "log", pad: "function_panel", pos: [1, 3], call: RPN.log, dump: true, inv: true},
        {label: 'yˣ', pad: "function_panel", pos: [2, 3], call: RPN.pow, dump: true},
        {label: 'ˣ√y', pad: "function_panel", pos: [2, 3], call: RPN.xsqrt, dump: true, inv: true},
        {label: "R↓", pad: "function_panel", pos: [1, 0], call: RPN.rotdn, dump: true},
        {label: "R↑", pad: "function_panel", pos: [1, 0], call: RPN.rotup, dump: true, inv: true},
        {label: 'C', pad: "function_panel", pos: [3, 0], call: RPN.clr},
//      {label: "CLx", pad: "function_panel", pos:[3,0], call:RPN.clx, inv: true}, //TODO
        {label: "⌫", pad: "function_panel", pos: [4, 0], call: RPN.del},
//      {label: "DRP", pad: "function_panel", pos: [4, 0], call: RPN.drop, inv: true}, //TODO
//      {label: "UNDO", pad: "function_panel", pos:[4,0], call:RPN.undo, inv: true}, //TODO
        {label: "×π", pad: "function_panel", pos: [3, 2], call: RPN.timespi, dump: true},
        {label: "x⇄y", pad: "function_panel", pos: [2, 0], call: RPN.swap, dump: true},
        {label: "RAD", pad: "function_panel", pos: [4, 2], call: RPN.rad, dump: true},
        {label: "DEG", pad: "function_panel", pos: [4, 2], call: RPN.deg, dump: true, inv: true},
        {label: "INV", pad: "function_panel", pos: [0, 0], call: setinv}, // FIXME: call scoping issue
        {label: "NRM", pad: "function_panel", pos: [0, 0], call: setnorm, inv: true} // FIXME: call scoping issue
    ],

    findParentTd: function (keypad, x, y) {
        var tbody = document.getElementById(keypad).firstChild.firstChild;
        return tbody.children[y].children[x];
    },

    findKey: function (label) {
        for (var i = 0; i < this.keymap.length; i++) {
            if (this.keymap[i].label == label) return this.keymap[i];
        }
    }
};

var updateDisplay = function () {
    var display = document.getElementById("display");
    var lines = [].slice.call(display.children); // turns HTMLCollection into Array
    lines = lines.map(function (e) {
        return e.firstChild  // fall through to inner <p>
    });
    if (RPN.isBufferEmpty()) {
        lines[0].textContent = "B " + RPN.fmt(3);
        lines[1].textContent = "A " + RPN.fmt(2);
        lines[2].textContent = "Y " + RPN.fmt(1);
        lines[3].textContent = "X " + RPN.fmt(0);
    } else {
        lines[0].textContent = "B " + RPN.fmt(2);
        lines[1].textContent = "A " + RPN.fmt(1);
        lines[2].textContent = "Y " + RPN.fmt(0);
        lines[3].textContent = "X " + RPN.fmtBuffer() + "◀"; // ◄ ◀
    }
    display.scrollTop = display.scrollHeight;  // make div scroll to bottom
};

var pushButton = function (event) {
    //console.log(event);
    if (event.target.className == "normkey" || event.target.className == "invkey") {
        var td = event.target;
        navigator.vibrate([35]);
        //console.log(td);
        var key = Keypad.findKey(td.textContent);
        console.log("calling", key.call, "with arg", key.label);
        if (key.dump) RPN.dump.bind(RPN)();
        if (key.call) key.call.bind(RPN, key.label)();
        console.log("result: ", RPN.stack.stack, RPN.buffer);
        updateDisplay();
    }
};

var multitouchHandler = function (event) {
    //console.log(event);
    pushButton(event);
}

var init = function () {
    console.log("READY.");
    Keypad.init();
    Keypad.loadKeymap("normal");
    updateDisplay();
    document.addEventListener("touchstart", function (event) {
        multitouchHandler(event)
    });
};

window.addEventListener('load', function load(event) {
    window.removeEventListener('load', load);
    init();
});

