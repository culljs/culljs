var cull = cull || require("./core");
var _ = _ || require("underscore");

var slice = Array.prototype.slice;
var refute = cull.refute;
var each = cull.each;
var all = cull.all;
var isFunction = cull.isFunction;

//"use locals";

function unary(fn) {
    return function (arg) {
        return fn.call(this, arg);
    };
}

function prop(name) {
    return function (object) {
        return object[name];
    };
}

function func(name) {
    return function (object) {
        return object[name]();
    };
}

function eq(one) {
    return function (other) { return one === other; };
}

var composeSignature = "compose takes func|[funcs] " +
                       "and optional thisp object";

function compose(fns, thisp) {
    refute(isFunction(thisp) || arguments.length > 2, composeSignature);

    fns = cull.toSeq(fns);

    refute(!all(isFunction, fns), composeSignature);

    return function () {
        var i = fns.length;
        var result = arguments;
        while (i--) {
            result = [fns[i].apply(thisp || this, result)];
        }
        return result[0];
    };
}

function partial(fn) {
    var args = [].slice.call(arguments, 1);
    return function () {
        return fn.apply(this, args.concat([].slice.call(arguments)));
    };
}

function bind(obj, methOrProp) {
    var method = typeof methOrProp === "string" ? obj[methOrProp] : methOrProp;
    var args = slice.call(arguments, 2);
    return function () {
        return method.apply(obj, args.concat(slice.call(arguments)));
    };
}

function handler(handlr, type) {
    if (typeof handlr === "function") { return handlr; }
    refute(typeof handlr[type] !== "function",
           "Handler has no method '" + type + "'");
    return bind.apply(null, arguments);
}

cull.fn = {
    unary: unary,
    prop: prop,
    func: func,
    eq: eq,
    compose: compose,
    partial: partial,
    bind: bind,
    handler: handler
};

module.exports = cull.fn;
