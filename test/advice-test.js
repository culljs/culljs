if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function (C) {
    "use strict";

    buster.testCase('cull.advice', {
        setUp: function () {
            this.obj = {
                list: [],
                fn: function (x, y) {
                    this.list.push(x);
                    return y;
                }
            };
        },

        "after": {
            setUp: function () {
                cull.after(this.obj, "fn", function (x) {
                    this.list.push(x + 1);
                });
            },

            "runs after the original function": function () {
                this.obj.fn(3);
                assert.equals(this.obj.list, [3, 4]);
            },

            "returns value from original function": function () {
                assert.equals(this.obj.fn(3, "ret"), "ret");
            }
        },

        "before": {
            setUp: function () {
                cull.before(this.obj, "fn", function (x) {
                    this.list.push(x - 1);
                });
            },

            "runs after the original function": function () {
                this.obj.fn(3);
                assert.equals(this.obj.list, [2, 3]);
            },

            "returns value from original function": function () {
                assert.equals(this.obj.fn(3, "ret"), "ret");
            }
        },

        "around": {
            "must call the original function itself": function () {
                cull.around(this.obj, "fn", function () {});
                this.obj.fn(3);
                assert.equals(this.obj.list, []);
            },

            "can call the original function itself": function () {
                cull.around(this.obj, "fn", function (orig, x, y) {
                    orig.call(this, x + 6);
                });
                this.obj.fn(3);
                assert.equals(this.obj.list, [9]);
            },

            "uses new return value": function () {
                cull.around(this.obj, "fn", function (orig, x, y) {
                    return x + orig.call(this, x, y);
                });
                assert.equals(this.obj.fn(3, "ret"), "3ret");
            }
        }
    });
}(cull));