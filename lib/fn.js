var cull = cull || require("./core");
var assertFunctions = cull.assertFunctions;
var slice = Array.prototype.slice;

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

function compose(fns, thisp) {
    if (typeof thisp === "function" || arguments.length > 2) {
        throw new TypeError("compose takes func|[funcs] and " +
                            "optional thisp object");
    }

    fns = cull.toSeq(fns);
    assertFunctions(fns, "compose");

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

function handler(handler, type) {
    if (typeof handler === "function") { return handler; }
    if (typeof handler[type] !== "function") {
        throw new TypeError("Handler has no method '" + type + "'");
    }
    return bind.apply(null, arguments);
}

cull.fn = {
    unary: unary,
    prop: prop,
    compose: compose,
    partial: partial,
    bind: bind,
    handler: handler
};

module.exports = cull.fn;
