var cull = {}, _;

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull;
    _ = require("underscore");
}

(function (C) {
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

    function compose(fns, thisp) {
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

    C.fn = {
        compose: compose
    };
}(cull));
