exports["Node tests"] = {
    environment: "node",
    sources: ["lib/*.js"],
    tests: ["test/*.js"],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint")
};

exports["Browser tests"] = {
    environment: "browser",
    sources: ["lib/*.js"],
    tests: ["test/*.js", "test/browser/*.js"],
    extensions: [require("buster-lint")],
    "buster-lint": require("./autolint")
};
