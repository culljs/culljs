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
                    return y - 1;
                }
            };
        },

        "after": {
            "runs after the original function": function () {
                cull.after(this.obj, "fn", function (ret, x) {
                    this.list.push(ret * x);
                });

                this.obj.fn(3, 2);

                assert.equals(this.obj.list, [3, 3]);
            },

            "returns value from original function": function () {
                cull.after(this.obj, "fn", function (ret, x) {
                    this.list.push(ret * x);
                });

                assert.equals(this.obj.fn(3, 7), 6);
            },

            "returns new value if given": function () {
                cull.after(this.obj, "fn", function (ret, x) {
                    this.list.push(ret * x);
                    return false;
                });

                assert.equals(this.obj.fn(3, 7), false);
            },

            "runs in same this-context": function () {
                var list = ["other"];
                cull.after(this.obj, "fn", function () {
                    this.list.push("after");
                });

                this.obj.fn.call({ list: list }, "x", "y");

                assert.equals(list, ["other", "x", "after"]);
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
                assert.equals(this.obj.fn(3, 7), 6);
            },

            "runs in same this-context": function () {
                var list = [42];
                this.obj.fn.call({ list: list }, 3);
                assert.equals(list, [42, 2, 3]);
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
                assert.equals(this.obj.fn(3, 7), 9);
            }
        }
    });
}(cull));