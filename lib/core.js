var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

//"use locals";

var assertFunction = function (fn, method) {
    if (typeof fn !== "function") {
        throw new TypeError(method +
                            " must receive function" +
                            " or an array of functions");
    }
};

function isSeq(seq) {
    return !!seq && typeof seq === "object" && typeof seq.length === "number";
}

function toSeq(value) {
    if (toString.call(value) === "[object Array]") { return value; }
    if (isSeq(value)) { return [].slice.call(value); }
    if (typeof value === "undefined" || value === null) { return []; }
    return [].slice.call(arguments);
}

function each(fn, seq) {
    var i, l;
    for (i = 0, l = seq.length; i < l; ++i) {
        fn(seq[i], i, seq);
    }
}

function assertFunctions(fns, method) {
    var i, l;
    for (i = 0, l = fns.length; i < l; i++) {
        assertFunction(fns[i], method);
    }
}

var identity = function (arg) { return arg; };
var defined = function (o) { return typeof o !== "undefined" && o !== null; };

var cull = {
    each: each,
    isSeq: isSeq,
    toSeq: toSeq,
    identity: identity,
    defined: defined,
    assertFunctions: assertFunctions
};

module.exports = cull;
