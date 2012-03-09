var cull = cull || require("./core");
var assertFunctions = cull.assertFunctions;

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

cull.fn = {
    unary: unary,
    prop: prop,
    compose: compose,
    partial: partial
};

module.exports = cull.fn;
