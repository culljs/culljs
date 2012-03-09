exports["Node tests"] = {
    environment: "node",
    sources: ["lib/*.js"],
    tests: ["test/*.js"],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint")
};

exports["Browser tests"] = {
    environment: "browser",
    libs: ["/node-shim.js"],
    sources: ["lib/core.js", "lib/fn.js", "lib/dom/*.js"],
    tests: ["test/dom/*.js"],
    resources: [{
        path: "/node-shim.js",
        "content": "var module = {}; var require = function () {};"
    }],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint")
};
