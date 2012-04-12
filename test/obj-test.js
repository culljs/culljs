if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function (C) {
    buster.testCase("object", {
        "keys": {
            "returns enumerable keys of object": function () {
                assert.equals(C.keys({
                    id: 1,
                    num: 42,
                    name: "Mr"
                }), ["id", "num", "name"]);
            }
        },

        "values": {
            "returns enumerable values of object": function () {
                assert.equals(C.values({
                    id: 1,
                    num: 42,
                    name: "Mr"
                }), [1, 42, "Mr"]);
            }
        }
    });

}(cull));
