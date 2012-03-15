if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

buster.testCase("DOM", {
    "add class": {
        "sets initial class name": function () {
            var div = { className: "" };
            cull.dom.addClassName("something", div);
            assert.className(div, "something");
        },

        "adds additional class name": function () {
            var div = { className: "hey" };
            cull.dom.addClassName("something", div);
            assert.className(div, "hey something");
        },

        "does not add duplicate class name": function () {
            var div = { className: "hey" };
            cull.dom.addClassName("hey", div);
            assert.equals(div.className, "hey");
        },

        "adds class name to all elements": function () {
            var divs = [
                { className: "hey" },
                { className: "" },
                { className: "meh heh" }
            ];
            cull.dom.addClassName("hola", divs);
            assert.equals(divs[0].className, "hey hola");
            assert.equals(divs[1].className, "hola");
            assert.equals(divs[2].className, "meh heh hola");
        },

        "does not duplicate class name for element in seq": function () {
            var divs = [
                { className: "hey" },
                { className: "" },
                { className: "meh heh" }
            ];
            cull.dom.addClassName("hey", divs);
            assert.equals(divs[0].className, "hey");
            assert.equals(divs[1].className, "hey");
            assert.equals(divs[2].className, "meh heh hey");
        }
    }
});