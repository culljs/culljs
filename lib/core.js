var slice = Array.prototype.slice;
var toString = Object.prototype.toString;
var _ = _ || require("underscore");

//"use locals";

function _assert(pred, msg) {
    if (!pred) { throw new TypeError(msg); }
}

function _refute(pred, msg) {
    _assert(!pred, msg);
}

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

function isFunction(fn) {
    return typeof fn === "function";
}

function reduce(fn, initial, seq) {
    if (arguments.length === 3) {
        return _.reduce(seq, fn, initial);
    }
    return _.reduce(initial, fn);
}

function all(fn, seq) {
    return reduce(function (memo, i) { return memo && fn(i); }, true, seq);
}

function trim(string) {
    return (string.trim && string.trim()) || string.replace(/^\s+|\s+$/, "");
}

var identity = function (arg) { return arg; };
var defined = function (o) { return typeof o !== "undefined" && o !== null; };

var cull = {
    _assert: _assert,
    _refute: _refute,
    trim: trim,
    each: each,
    reduce: reduce,
    all: all,
    isFunction: isFunction,
    isSeq: isSeq,
    toSeq: toSeq,
    identity: identity,
    defined: defined
};

module.exports = cull;
