if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";

    buster.testCase("cull.core", {
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
        }
    });
}());