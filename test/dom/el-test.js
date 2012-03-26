(function (d) {
    buster.testCase("Element", {
        "setProp": {
            "sets property on element": function () {
                var el = document.createElement("div");
                d.el.setProp({ "className": "hey" }, el);
                assert.className(el, "hey");
            },

            "does nothing if no properties": function () {
                refute.exception(function () {
                    d.el.setProp(null, document.createElement("div"));
                });
            },

            "sets data attribute property": function () {
                var el = document.createElement("div");
                d.el.setProp({ "data-preselected": "42" }, el);
                assert.equals(el["data-preselected"], "42");
            }
        },

        "content": {
            setUp: function () {
                this.el = document.createElement("div");
                this.el.innerHTML = "<h1>Hey</h1>";
            },

            "removes existing content": function () {
                d.el.content("", this.el);
                refute.match(this.el.innerHTML, "Hey");
            },

            "adds string content": function () {
                d.el.content("Vanilla", this.el);
                assert.equals(this.el.innerHTML, "Vanilla");
            },

            "adds DOM element content": function () {
                var child = document.createElement("h2");
                child.innerHTML = "Yes!";
                d.el.content(child, this.el);
                assert.equals(this.el.innerHTML, "<h2>Yes!</h2>");
            },

            "adds mixed content": function () {
                var child = document.createElement("h2");
                child.innerHTML = "Yes!";
                d.el.content([child, "Tihi"], this.el);
                assert.equals(this.el.innerHTML, "<h2>Yes!</h2>Tihi");
            },

            "escapes text content": function () {
                d.el.content("<p>Tihi</p>", this.el);
                assert.equals(this.el.innerHTML, "&lt;p&gt;Tihi&lt;/p&gt;");
            }
        },

        "builder": {
            "creates div element": function () {
                var div = cull.fn.partial(d.el, "div");
                assert.tagName(div(), "div");
            },

            "creates element with attribute property": function () {
                var a = cull.fn.partial(d.el, "a");
                assert.match(a({ href: "/yo" }).href, /\/yo$/);
            },

            "creates element with multiple attribute properties": function () {
                var a = cull.fn.partial(d.el, "a");
                var link = a({ href: "/yo", className: "link-thingie" });

                assert.className(link, "link-thingie");
                assert.match(link.href, /\/yo$/);
            },

            "creates element with child": function () {
                var div = cull.fn.partial(d.el, "div");
                var el = div(div());

                assert.equals(el.childNodes.length, 1);
            },

            "creates element with children": function () {
                var div = cull.fn.partial(d.el, "div");
                var el = div([div(), div()]);

                assert.equals(el.childNodes.length, 2);
            },

            "complains about multiple element arguments": function () {
                var div = cull.fn.partial(d.el, "div");
                assert.exception(function () {
                    div(div(), div(), div(), div());
                }, "TypeError");
            },

            "complains about tagName property for element": function () {
                var div = cull.fn.partial(d.el, "div");

                assert.exception(function () {
                    div(div(), div());
                }, "TypeError");
            },

            "creates element with children and properties": function () {
                var div = cull.fn.partial(d.el, "div");
                var el = div({ className: "hey", id: "ho" }, div());

                assert.equals(el.childNodes.length, 1);
                assert.className(el, "hey");
                assert.equals(el.id, "ho");
            },

            "creates element with text content": function () {
                var h2 = cull.fn.partial(d.el, "h2");
                var el = h2("Hey man");

                assert.equals(el.innerHTML, "Hey man");
            },

            "should not insert text as html": function () {
                var div = cull.fn.partial(d.el, "div");
                var el = div("<p>x</p><p>s</p><p>s</p>");

                assert.equals(el.childNodes.length, 1);
            },

            "creates element with text and DOM element content": function () {
                var div = cull.fn.partial(d.el, "div");
                var el = div(["Hey man", div(), "Awright"]);

                assert.match(el.innerHTML, /hey man\s*<div><\/div>awright/i);
            },

            "sets style properties": function () {
                var div = cull.fn.partial(d.el, "div");
                var el = div({ style: { position: "relative" } });

                assert.equals(el.style.position, "relative");
            },

            "creates element with customly handled atrribute": function () {
                var div = cull.fn.partial(d.el, "div");
                d.el.propmap["for"] = function (el, attr) {
                    el.htmlFor = attr;
                };

                var el = div({ "for": "somebody" });

                assert.equals(el.htmlFor, "somebody");
            },

            "creates div element directly": function () {
                var div = d.el("div", { className: "Yay" });
                assert.tagName(div, "div");
                assert.className(div, "Yay");
            }
        }
    });
}(cull.dom));