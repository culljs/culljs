/*jslint browser: true */
var cull = cull || require("./core");
var seq = cull.seq || require("./seq");
var fn = cull.fn || require("./fn");
var isSeq = cull.isSeq;
var flatten = seq.flatten;
var each = seq.each;
var map = seq.map;
var uniq = seq.uniq;
var reduce = seq.reduce;
var concat = seq.concat;
var partial = fn.partial;

//"use locals";

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
    var select = function (seq, selector) {
        if (/^#/.test(selector)) {
            return seq.concat(id(selector.slice(1)));
        } else if (/^\./.test(selector)) {
            var className = selector.slice(1);
            return concat(seq, parent.getElementsByClassName(className));
        } else {
            return concat(seq, parent.getElementsByTagName(selector));
        }
    };
    return uniq(reduce(select, [], cull.toSeq(selectors)));
}

function remove(element) {
    element.parentNode.removeChild(element);
}

function hasClassName(className, element) {
    var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
    return regexp.test(element.className);
}

function addClassName(className, element) {
    if (isSeq(element)) {
        return each(partial(addClassName, className), element);
    }
    if (hasClassName(className, element)) { return; }
    var newClass = element.className + " " + className;
    element.className = newClass.replace(/^\s+|\s+$/, "");
}

cull.dom = {
    children: children,
    id: id,
    get: get,
    remove: remove,
    addClassName: addClassName
};

module.exports = cull.dom;
