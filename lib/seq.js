var cull = cull || {};
cull.fn = cull.fn || require("./fn");
var _ = _ || require("underscore");
var partial = cull.fn.partial;
var defined = cull.fn.defined;

"use locals";

var switchArgs = function (obj, name) {
    return function (fn, seq) {
        return obj[name](seq, fn);
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
var flatten = _.flatten;
var uniq = _.uniq;
var reduce = _.reduce;

var seldef = partial(select, defined);
var mapdef = function (fn, coll) { return seldef(map(fn, seldef(coll))); };

cull.seq = seq;
seq.isSeq = isSeq;
seq.seq = seq;
seq.concat = concat;
seq.map = map;
seq.mapdef = mapdef;
seq.select = select;
seq.seldef = seldef;
seq.flatten = flatten;
seq.uniq = uniq;
seq.reduce = reduce;

"export";

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull.seq;
}
