if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";

    buster.testCase("cull.core", {
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