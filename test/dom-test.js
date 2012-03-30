if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function (d) {
    var cn = d.cn;

    buster.testCase("DOM", {
        "add class": {
            "sets initial class name": function () {
                var div = { className: "" };
                cn.add("something", div);
                assert.className(div, "something");
            },

            "adds additional class name": function () {
                var div = { className: "hey" };
                cn.add("something", div);
                assert.className(div, "hey something");
            },

            "does not add duplicate class name": function () {
                var div = { className: "hey" };
                cn.add("hey", div);
                assert.equals(div.className, "hey");
            },

            "adds class name to all elements": function () {
                var divs = [
                    { className: "hey" },
                    { className: "" },
                    { className: "meh heh" }
                ];
                cn.add("hola", divs);
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
                cn.add("hey", divs);
                assert.equals(divs[0].className, "hey");
                assert.equals(divs[1].className, "hey");
                assert.equals(divs[2].className, "meh heh hey");
            }
        },

        "remove class": {
            "does nothing when element has no classes": function () {
                var div = { className: "" };
                cn.rm("something", div);
                assert.equals(div.className, "");
            },

            "removes only matching class": function () {
                var div = { className: "something" };
                cn.rm("something", div);
                assert.equals(div.className, "");
            },

            "removes matching class": function () {
                var div = { className: "hey something there" };
                cn.rm("something", div);
                assert.equals(div.className, "hey there");
            },

            "removes matching class when last": function () {
                var div = { className: "something there" };
                cn.rm("there", div);
                assert.equals(div.className, "something");
            },

            "removes matching class from all elements": function () {
                var divs = [
                    { className: "meh" },
                    { className: "some thing eh" },
                    { className: "heh meh" }
                ];
                cn.rm("meh", divs);
                assert.equals(divs[0].className, "");
                assert.equals(divs[1].className, "some thing eh");
                assert.equals(divs[2].className, "heh");
            }
        },

        "frag": {
            requiresSupportFor: {
                "document": typeof document !== "undefined"
            },

            "returns document fragment": function () {
                var frag = d.frag();
                assert.equals(frag.nodeType, 11);
            }
        }
    });
}(cull.dom));