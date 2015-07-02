/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function (exports) {
    'use strict';

    exports.RPN = {
        stack: new Stack(),
        buffer: new Buffer(),

        push: function (val) {
            this.stack.push(val);
        },
        pop: function () {
            return this.stack.pop();
        },
        swap: function () {
            this.stack.swap();
        },
        add: function () {
            this.push(math.add(this.pop(), this.pop()));
        },
        sub: function () {
            this.swap();
            this.push(math.subtract(this.pop(), this.pop()));
        },
        mul: function () {
            this.push(math.multiply(this.pop(), this.pop()));
        },
        div: function () {
            this.swap();
            this.push(math.divide(this.pop(), this.pop()));
        },
        neg: function () {
            this.push(math.subtract(0, this.pop()));
        },
        recip: function () {
            this.push(math.divide(1, this.pop()));
        },
        sin: function () {
            this.push(math.sin(this.pop()));
        },
        cos: function () {
            this.push(math.cos(this.pop()));
        },
        tan: function () {
            this.push(math.tan(this.pop()));
        },
        asin: function () {
            this.push(math.asin(this.pop()));
        },
        acos: function () {
            this.push(math.acos(this.pop()));
        },
        atan: function () {
            this.push(math.atan(this.pop()));
        },
        exp: function () {
            this.push(math.exp(this.pop()));
        },
        xsqrt: function () {
            this.swap();
            this.push(math.nthRoot(this.pop(), this.pop()));
        },
        ln: function () {
            this.push(math.log(this.pop()));
        },
        exp10: function () {
            this.push(math.pow(10, this.pop()));
        },
        log: function () {
            this.push(math.log10(this.pop()));
        },
        sqrt: function () {
            this.push(math.sqrt(this.pop()));
        },
        square: function () {
            this.push(math.square(this.pop()));
        },
        pow: function () {
            this.swap();
            this.push(math.pow(this.pop(), this.pop()));
        },
        timespi: function () {
            this.push(math.multiply(this.pop(), math.PI));
        },
        rad: function () {
            this.push(math.multiply(2, math.multiply(math.PI, math.divide(this.pop(), 360))));
        },
        deg: function () {
            this.push(math.multiply(360, math.divide(this.pop(), math.multiply(2, math.PI))));
        },
        isBufferEmpty: function () {
            return this.buffer.isEmpty();
        },
        valueBuffer: function () {
            return this.buffer.value();
        },
        fmtBuffer: function () {
            return this.buffer.buffer;
        },
        append: function (c) {
            switch (c) {
                case "±":
                    if (this.buffer.isEmpty()) {
                        this.neg();
                        return;
                    }
                    break;
            }
            this.buffer.append(c)
        },
        del: function () {
            this.buffer.del()
        },
        clr: function () {
            // TODO: remove implicit drop, create dedicated drop key
            if (this.buffer.isEmpty()) {
                this.pop();
            } else {
                this.buffer.clr();
            }
        },
        dump: function () {
            if (!this.buffer.isEmpty()) {
                var bv = this.buffer.value();
                this.push(bv);
                this.buffer.clr();
            }
        },
        enter: function () {
            if (!this.buffer.isEmpty()) {
                this.dump();
            } else {
                this.push(this.stack.x());
            }
        },
        fmt: function (stack_id) {
            var s = math.format(RPN.stack.get(stack_id));
            s = s.replace(new RegExp("Infinity", "g"), "∞");
            s = s.replace(new RegExp("e", "g"), "E");
            return s;
        }
    };

})(this);
