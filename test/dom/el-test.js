buster.testCase("Element builder", {
    "creates div element": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        assert.tagName(div(), "div");
    },

    "creates element with attribute": function () {
        var a = cull.fn.partial(cull.dom.el, "a");
        assert.match(a({ href: "/yo" }).href, /\/yo$/);
    },

    "creates element with multiple attributes": function () {
        var a = cull.fn.partial(cull.dom.el, "a");
        var link = a({ href: "/yo", className: "link-thingie" });

        assert.className(link, "link-thingie");
        assert.match(link.href, /\/yo$/);
    },

    "creates element with children": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        var el = div(div());

        assert.equals(el.childNodes.length, 1);
    },

    "creates element with children and attributes": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        var el = div({ className: "hey", id: "ho" }, div());

        assert.equals(el.childNodes.length, 1);
        assert.className(el, "hey");
        assert.equals(el.id, "ho");
    },

    "creates element with text content": function () {
        var h2 = cull.fn.partial(cull.dom.el, "h2");
        var el = h2("Hey man");

        assert.equals(el.innerHTML, "Hey man");
    },

    "should not insert text as html": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        var el = div("<p>x</p><p>s</p><p>s</p>");

        assert.equals(el.childNodes.length, 1);
    },

    "creates element with text and DOM element content": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        var el = div(["Hey man", div(), "Awright"]);

        assert.match(el.innerHTML, /hey man\s*<div><\/div>awright/i);
    },

    "sets style properties": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        var el = div({ style: { position: "relative" } });

        assert.equals(el.style.position, "relative");
    },

    "creates element with customly handled atrribute": function () {
        var div = cull.fn.partial(cull.dom.el, "div");
        cull.dom.el.attrHandlers["for"] = function (el, attr) {
            el.htmlFor = attr;
        };

        var el = div({ "for": "somebody" });

        assert.equals(el.htmlFor, "somebody");
    },

    "creates div element directly": function () {
        var div = cull.dom.el("div", { className: "Yay" });
        assert.tagName(div, "div");
        assert.className(div, "Yay");
    }
});
