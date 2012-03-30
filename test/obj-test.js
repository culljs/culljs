if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function (o) {
    buster.testCase("object", {
        "keys": {
            "returns enumerable keys of object": function () {
                assert.equals(o.keys({
                    id: 1,
                    num: 42,
                    name: "Mr"
                }), ["id", "num", "name"]);
            }
        }
    });

}(cull.obj));
