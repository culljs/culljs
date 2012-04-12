if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";

    buster.testCase("cull.core", {
        "reduce": {
            "sums numbers": function () {
                var seq = [1, 2, 3, 4];
                var add = function (a, b) { return a + b; };
                assert.equals(cull.reduce(add, seq), 10);
            },

            "sums numbers with seed value": function () {
                var seq = [1, 2, 3, 4];
                var add = function (a, b) { return a + b; };
                assert.equals(cull.reduce(add, 5, seq), 15);
            }
        },

        "toSeq": {
            "returns array unmodified": function () {
                var arr = [1, 2, 3];
                assert.same(cull.toSeq(arr), arr);
            },

            "returns empty array for null": function () {
                assert.equals(cull.toSeq(null), []);
            },

            "returns empty array for missing argument": function () {
                assert.equals(cull.toSeq(), []);
            },

            "returns empty array for undefined": function () {
                assert.equals(cull.toSeq(undefined), []);
            },

            "returns scalar as array": function () {
                assert.equals(cull.toSeq(1), [1]);
            },

            "returns arguments as true array": function () {
                var args = function () { return arguments; };
                assert.isArray(cull.toSeq(args(1, 2, 3)));
            }
        },

        "identity": {
            "returns first argument": function () {
                assert.equals(cull.identity(4, 2), 4);
            },

            "returns null": function () {
                assert.equals(cull.identity(null), null);
            },

            "returns undefined without arguments": function () {
                assert.equals(cull.identity(), undefined);
            }
        },

        "all": {
            "is true for all truthy values": function () {
                assert(cull.all(cull.identity, [1, 2, 3, 4]));
            },

            "is false when some are falsy": function () {
                refute(cull.all(cull.identity, [1, 2, 3, 0]));
            }
        },

        "some": {
            "is true for some truthy values": function () {
                assert(cull.some(cull.identity, [1, 0, 3, 0]));
            },

            "is false for all falsy values": function () {
                refute(cull.some(cull.identity, [0, 0, 0, 0]));
            }
        }
    });
}());