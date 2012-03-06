var cull = {}, _;

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull;
    _ = require("underscore");
}

(function (C) {
    var flatten = _.flatten;
    var each = _.each;

    // Sequences

    function isSeq(seq) {
        return !!seq && typeof seq == "object" && typeof seq.length == "number";
    }

    function seq(value) {
        if (isSeq(value)) { return value; }
        return [].slice.call(arguments);
    }

    // Functional

    function prop(name) {
        return function (object) {
            return object[name];
        };
    }

    function compose(fns, thisp) {
        if (typeof thisp === "function" || arguments.length > 2) {
            throw new TypeError("compose takes func|[funcs] and optional thisp object");
        }
        fns = seq(fns || []);
        each(fns, function (fn) {
            if (typeof fn != "function") {
                throw new TypeError("compose must receive function or an array of functions");
            }
        });
        return function () {
            var i = fns.length;
            var result = arguments;
            while (i--) {
                result = [fns[i].apply(thisp, result)];
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

    function reversedIterator(name) {
        return function (fn, seq) {
            return _[name](seq, fn);
        };
    }

    var map = reversedIterator("map");
    var select = reversedIterator("filter");
    var identity = compose();
    var defined = function (o) { return typeof o !== "undefined" && o !== null; };
    var seldef = partial(select, defined);

    var mapdef = function (fn, coll) {
        return seldef(map(fn, seldef(coll)));
    };

    C.fn = {
        identity: identity,
        defined: defined,
        prop: prop,
        compose: compose,
        partial: partial,
        map: map,
        select: select,
        seldef: seldef,
        mapdef: mapdef
    };
}(cull));
