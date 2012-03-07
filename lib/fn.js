var cull = cull || {};

"use locals";

var unary = function (fn) {
    return function (arg) {
        return fn.call(this, arg);
    };
};

var prop = function (name) {
    return function (object) {
        return object[name];
    };
};

var isArray = function (a) {
    return a && typeof a.length === "number" && typeof a !== "string";
};

var coerceArray = function (a) {
    if (!a) { return []; }
    return isArray(a) ? a : [a];
};

var assertFunction = function (fn, method) {
    if (typeof fn !== "function") {
        throw new TypeError(method +
                            " must receive function" +
                            " or an array of functions");
    }
};

var assertFunctions = function (fns, method) {
    var i, l;
    for (i = 0, l = fns.length; i < l; i++) {
        assertFunction(fns[i], method);
    }
};

var compose = function (fns, thisp) {
    if (typeof thisp === "function" || arguments.length > 2) {
        throw new TypeError("compose takes func|[funcs] and " +
                            "optional thisp object");
    }

    fns = coerceArray(fns);
    assertFunctions(fns, "compose");

    return function () {
        var i = fns.length;
        var result = arguments;
        while (i--) {
            result = [fns[i].apply(thisp || this, result)];
        }
        return result[0];
    };
};

var partial = function (fn) {
    var args = [].slice.call(arguments, 1);
    return function () {
        return fn.apply(this, args.concat([].slice.call(arguments)));
    };
};

var identity = compose();
var defined = function (o) { return typeof o !== "undefined" && o !== null; };

cull.fn = {
    unary: unary,
    prop: prop,
    compose: compose,
    partial: partial,
    identity: identity,
    defined: defined
};

"export";

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull.fn;
}
