var cull = require("./core");
var fn = require("./fn");
var _ = require("underscore");
var partial = fn.partial;
var defined = cull.defined;
var slice = Array.prototype.slice;

//"use locals";

var switchArgs = function (obj, name) {
    return function (fn, seq) {
        return obj[name].apply(obj, [seq, fn].concat(slice.call(arguments, 2)));
    };
};

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

function cut(n, seq) {
    var result = [], curr = 0, per, i;
    for (i = 0; i < n; ++i) {
        per = Math.ceil((seq.length - curr) / (n - i));
        result[i] = seq.slice(curr, curr + per);
        curr += per;
    }
    return result;
}

function partition(n, seq) {
    var result = [], i, l;
    for (i = 0, l = seq.length; i < l; i += n) {
        result.push(seq.slice(i, i + n));
    }
    return result;
}

var flatten = _.flatten;
var uniq = _.uniq;
var select = switchArgs(_, "filter");
var seldef = partial(select, defined);
var map = switchArgs(_, "map");
var mapdef = function (fn, coll) { return seldef(map(fn, seldef(coll))); };

cull.seq = {
    concat: concat,
    reduce: reduce,
    flatten: flatten,
    uniq: uniq,
    select: select,
    seldef: seldef,
    map: map,
    mapdef: mapdef,
    cut: cut,
    partition: partition
};

module.exports = cull.seq;
