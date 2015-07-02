/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (exports) {
    'use strict';

    exports.Buffer = function () {
        this.clr();
    };

    exports.Buffer.prototype.clr = function () {
        this.buffer = "";
    };

    exports.Buffer.prototype.isEmpty = function () {
        return this.buffer.length == 0;
    };

    exports.Buffer.prototype.del = function (n) {
        if (typeof n !== 'undefined') {
            this.buffer = this.buffer.slice(0, n) + this.buffer.slice(n + 1, this.buffer.length);
        } else {
            this.buffer = this.buffer.substring(0, this.buffer.length - 1);
        }
    };

    exports.Buffer.prototype.ins = function (n, c) {
        this.buffer = this.buffer.slice(0, n) + c + this.buffer.slice(n, this.buffer.length);
    };

    exports.Buffer.prototype.append = function (c) {
        switch (c) {
            case "±":
                var epos = this.buffer.indexOf("E");
                if (this.buffer[epos + 1] == "-") {
                    this.del(epos + 1);
                } else {
                    this.ins(epos + 1, "-");
                }
                break;
            case "E":
                if (this.buffer.indexOf("E") == -1) this.buffer += "E";
                break;
            case ".":
                if (this.buffer.indexOf(".") == -1) this.buffer += ".";
                break;
            default:
                this.buffer += c;
        }
    };

    exports.Buffer.prototype.value = function () {
        return math.eval(this.buffer); // Uh-oh!
        // Then again: buffer *should* only ever contain
        // combinations of key label constants.
    };

})(this);
