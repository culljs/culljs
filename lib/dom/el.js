/*jslint browser: true*/
var cull = cull || {};
cull.dom = cull.dom || {};
var partial = cull.fn.partial;

//"use locals";
var el;

function attr(element, attributes) {
    var attribute, handler;

    for (attribute in attributes) {
        if (attributes.hasOwnProperty(attribute)) {
            handler = el.attrHandlers[attribute];
            if (handler) {
                handler(element, attributes[attribute]);
            } else {
                element[attribute] = attributes[attribute];
            }
        }
    }

    return element;
}

function addContent(element, content) {
    var i, l;
    for (i = 0, l = content.length; i < l; ++i) {
        if (typeof content[i] === "string") {
            element.appendChild(document.createTextNode(content[i]));
        } else {
            element.appendChild(content[i]);
        }
    }

    return element;
}

var isContent = function (content) {
    return content &&
        (typeof content.nodeType !== "undefined" ||
         typeof content === "string" ||
         cull.isSeq(content));
};

el = function (tagName, attributes, content) {
    if (!content && isContent(attributes)) {
        content = attributes;
        attributes = {};
    }
    var element = document.createElement(tagName);
    return addContent(attr(element, attributes), cull.toSeq(content));
};

el.attrHandlers = {
    style: function (el, styles) {
        var prop;
        for (prop in styles) {
            if (styles.hasOwnProperty(prop)) {
                el.style[prop] = styles[prop];
            }
        }
    }
};

cull.each(function (tagName) {
    el[tagName] = partial(el, tagName);
}, ["a", "br", "div", "fieldset", "form", "h2", "h3", "h4", "img", "input",
    "label", "li", "p", "span", "strong", "textarea", "ul", "span"]);

el.attr = attr;
el.addContent = addContent;
cull.dom.el = el;
