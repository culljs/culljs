/*jslint browser: true */
var cull = cull || require("./core");
var seq = cull.seq || require("./seq");
var fn = cull.fn || require("./fn");
var isSeq = cull.isSeq;
var flatten = seq.flatten;
var doall = seq.doall;
var map = seq.map;
var uniq = seq.uniq;
var reduce = cull.reduce;
var concat = seq.concat;
var partial = fn.partial;
var trim = cull.trim;
var toSeq = cull.toSeq;
var bind = cull.bind;

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

function addClassName(cn, element) {
    if (isSeq(element)) { return doall(partial(addClassName, cn), element); }
    if (hasClassName(cn, element)) { return; }
    element.className = trim(element.className + " " + cn);
}

function removeClassName(cn, element) {
    if (isSeq(element)) { return doall(partial(removeClassName, cn), element); }
    if (!hasClassName(cn, element)) { return; }
    var regexp = new RegExp("(^|\\s)" + cn + "(\\s|$)");
    element.className = trim(element.className.replace(regexp, " "));
}

function frag(items) {
    var fragment = document.createDocumentFragment();
    doall(bind(fragment, "appendChild"), toSeq(items));
    return fragment;
}

cull.dom = {
    children: children,
    id: id,
    get: get,
    remove: remove,
    frag: frag,
    cn: {
        add: addClassName,
        rm: removeClassName
    }
};

module.exports = cull.dom;
