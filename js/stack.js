/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (exports) {
    'use strict';

    exports.Stack = function () {
        this.stack = [0, 0, 0, 0];
    };

    exports.Stack.prototype.get = function (n) {
        return this.stack[n];
    };

    exports.Stack.prototype.x = function () {
        return this.stack[0];
    };

    exports.Stack.prototype.y = function () {
        return this.stack[1];
    };

    exports.Stack.prototype.xy = function () {
        return this.stack.slice(0, 2);
    };

    exports.Stack.prototype.setx = function (val) {
        this.stack[0] = val;
    };

    exports.Stack.prototype.sety = function (val) {
        this.stack[1] = val;
    };

    exports.Stack.prototype.tail = function () {
        return this.stack[this.stack.length - 1];
    };

    exports.Stack.prototype.push = function (val) {
        this.stack.unshift(val);
        this.stack.pop();
    };

    exports.Stack.prototype.pop = function () {
        this.stack.push(this.tail());
        return this.stack.shift()
    };

    exports.Stack.prototype.swap = function () {
        var x = this.stack[0];
        this.stack[0] = this.stack[1];
        this.stack[1] = x;
    };

    exports.Stack.prototype.rotdn = function () {
        this.stack.push(this.stack.shift());
    };

    exports.Stack.prototype.rotup = function () {
        this.stack.unshift(this.stack.pop());
    };

})(this);