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

function isSeq(seq) {
    return !!seq && typeof seq === "object" && typeof seq.length === "number";
}

function seq(value) {
    if (isSeq(value)) { return value; }
    return [].slice.call(arguments);
}

function concat(seq, items) {
    var toAdd = [], i, l;
    for (i = 0, l = items.length; i < l; ++i) {
        toAdd.push(items[i]);
    }
    return seq.concat(toAdd);
}

function reduce(fn, initial, seq) {
    if (arguments.length === 3) {
        return _.reduce(seq, fn, initial);
    }
    return _.reduce(initial, fn);
}

cull.seq = seq;
seq.isSeq = isSeq;
seq.seq = seq;
seq.concat = concat;
seq.reduce = reduce;
var flatten = seq.flatten = _.flatten;
var uniq = seq.uniq = _.uniq;
var select = seq.select = switchArgs(_, "filter");
var seldef = seq.seldef = partial(select, defined);
var map = seq.map = switchArgs(_, "map");
var mapdef = function (fn, coll) { return seldef(map(fn, seldef(coll))); };
seq.mapdef = mapdef;

module.exports = cull.seq;
