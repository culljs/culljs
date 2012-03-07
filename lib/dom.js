var cull = {};
var seq = cull.seq || require("./seq");
var isSeq = seq.isSeq;
var flatten = seq.flatten;
var map = seq.map;
var uniq = seq.uniq;
var reduce = seq.reduce;
var concat = seq.concat;

"use locals";

function children(elements) {
    if (isSeq(elements)) { return flatten(map(children, elements)); }
    var results = [], child = elements.firstChild;
    while (child) {
        if (child.nodeType === 1) { results.push(child); }
        child = child.nextSibling;
    }
    return results;
}

function id(idStr) {
    return document.getElementById(idStr);
}

function get(selectors, parent) {
    if (!parent) { parent = document; }
    return uniq(reduce(seq(selectors), function (seq, selector) {
        if (/^#/.test(selector)) {
            return seq.concat(id(selector.slice(1)));
        } else if (/^\./.test(selector)) {
            var className = selector.slice(1);
            return concat(seq, parent.getElementsByClassName(className));
        } else {
            return concat(seq, parent.getElementsByTagName(selector));
        }
    }, []));
}

function remove(element) {
    element.parentNode.removeChild(element);
}

cull.dom = {
    children: children,
    id: id,
    get: get,
    remove: remove
};

"export";

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull.dom;
}