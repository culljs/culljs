var cull = cull || require("./core");
var fn = cull.fn || require("./fn");
var _ = _ || require("underscore");
var partial = fn.partial;
var defined = cull.defined;
var slice = Array.prototype.slice;
var toSeq = cull.toSeq;
var reduce = cull.reduce;

//"use locals";

var switchArgs = function (obj, name) {
    return function (fn, seq) {
        return obj[name].apply(obj, [seq, fn].concat(slice.call(arguments, 2)));
    };
};

var flatten = _.flatten;
var uniq = _.uniq;
var select = switchArgs(_, "filter");
var seldef = partial(select, defined);
var map = switchArgs(_, "map");
var doall = switchArgs(_, "each");

function negate(pred) {
    return function () {
        return !pred.apply(this, arguments);
    };
}

function reject(pred, seq) {
    return select(negate(pred), seq);
}

function concat(seq, items) {
    return toSeq(seq).concat(toSeq(items));
}

function partition(n, seq) {
    var result = [], i, l;
    for (i = 0, l = seq.length; i < l; i += n) {
        result.push(seq.slice(i, i + n));
    }
    return result;
}

function mapdef(fn, coll) {
    return seldef(map(fn, seldef(coll)));
}

function mapcat(fn, coll) {
    return reduce(concat, map(fn, coll));
}

cull.seq = {
    concat: concat,
    flatten: flatten,
    uniq: uniq,
    select: select,
    reject: reject,
    seldef: seldef,
    map: map,
    doall: doall,
    mapdef: mapdef,
    mapcat: mapcat,
    partition: partition
};

module.exports = cull.seq;
