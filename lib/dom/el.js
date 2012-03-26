/*jslint browser: true*/
var cull = cull || {};
cull.dom = cull.dom || {};
var partial = cull.fn.partial;
var _refute = cull._refute;
var _assert = cull._assert;

//"use locals";
var el;

var isContent = function (content) {
    return content !== null && typeof content !== "undefined" &&
        (typeof content.nodeType !== "undefined" ||
         typeof content === "string" ||
         cull.isSeq(content));
};

function setProp(properties, element) {
    var name, mapper;
    properties = properties || {};

    for (name in properties) {
        if (properties.hasOwnProperty(name)) {
            mapper = el.propmap[name];
            if (mapper) {
                mapper(element, properties[name]);
            } else {
                element[name] = properties[name];
            }
        }
    }
}

function append(content, element) {
    _assert(isContent(content),
            "Content should be one or a list of [string, DOM element]");
    content = cull.toSeq(content);
    var i, l;
    for (i = 0, l = content.length; i < l; ++i) {
        if (typeof content[i] === "string") {
            element.appendChild(document.createTextNode(content[i]));
        } else {
            element.appendChild(content[i]);
        }
    }
}

function content(children, element) {
    _assert(element && typeof element.innerHTML !== "undefined",
            "content() needs element");
    element.innerHTML = "";
    append(children, element);
}

el = function (tagName, attrProps, content) {
    _refute(arguments.length > 3,
           "Content should be one or a list of [string, DOM element]");
    if (!content && isContent(attrProps)) {
        content = attrProps;
        attrProps = {};
    }
    _refute(attrProps && attrProps.tagName,
           "Cannot set attribute property tagName. Use a list when " +
           "adding multiple content elements.");
    var element = document.createElement(tagName);
    setProp(attrProps, element);
    append(content || [], element);
    return element;
};

el.propmap = {
    style: function (el, styles) {
        var property;
        for (property in styles) {
            if (styles.hasOwnProperty(property)) {
                el.style[property] = styles[property];
            }
        }
    }
};

cull.each(function (tagName) {
    el[tagName] = partial(el, tagName);
}, ["a", "br", "div", "fieldset", "form", "h2", "h3", "h4", "img",
    "input", "label", "li", "p", "span", "strong", "textarea", "ul",
    "span", "select", "option"]);

el.setProp = setProp;
el.append = append;
el.content = content;
cull.dom.el = el;
