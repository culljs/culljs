var cull = cull || {};
cull.fn = cull.fn || require("./fn");
var _ = _ || require("underscore");
var partial = cull.fn.partial;
var defined = cull.fn.defined;
var slice = Array.prototype.slice;

//"use locals";

var switchArgs = function (obj, name) {
    return function (fn, seq) {
        return obj[name].apply(obj, [seq, fn].concat(slice.call(arguments, 2)));
    };
};

var isSeq = function (seq) {
    return !!seq && typeof seq === "object" && typeof seq.length === "number";
};

var seq = function (value) {
    if (isSeq(value)) { return value; }
    return [].slice.call(arguments);
};

var concat = function (seq, items) {
    var toAdd = [], i, l;
    for (i = 0, l = items.length; i < l; ++i) {
        toAdd.push(items[i]);
    }
    return seq.concat(toAdd);
};

var map = switchArgs(_, "map");
var select = switchArgs(_, "filter");
var seldef = partial(select, defined);
var mapdef = function (fn, coll) { return seldef(map(fn, seldef(coll))); };

var reduce = function (fn, initial, seq) {
    if (arguments.length === 3) {
        return _.reduce(seq, fn, initial);
    }
    return _.reduce(initial, fn);
};

cull.seq = seq;
seq.isSeq = isSeq;
seq.seq = seq;
seq.concat = concat;
seq.map = map;
seq.mapdef = mapdef;
seq.select = select;
seq.seldef = seldef;
seq.reduce = reduce;
var flatten = seq.flatten = _.flatten;
var uniq = seq.uniq = _.uniq;

//"export";

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull.seq;
}
