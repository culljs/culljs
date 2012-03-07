module.exports = {
    seq: require("./seq"),
    fn: require("./fn")
};

// var cull = {}, _;

// if (typeof require === "function" && typeof module !== "undefined") {
//     module.exports = cull;
//     _ = require("underscore");
// }

// (function (C) {
//     var toString = Object.prototype.toString;
//     var uniq = _.uniq;
//     var reduce = _.reduce;
//     var flatten = _.flatten;
//     var each = _.each;

//     // Sequences

//     function isSeq(seq) {
//         return !!seq && typeof seq == "object" && typeof seq.length == "number";
//     }

//     function seq(value) {
//         if (isSeq(value)) { return value; }
//         return [].slice.call(arguments);
//     }

//     function concat(seq, items) {
//         var toAdd = [];
//         for (var i = 0, l = items.length; i < l; ++i) {
//             toAdd.push(items[i]);
//         }
//         return seq.concat(toAdd);
//     }

//     // Functional

//     function unary(fn) {
//         return function (arg) {
//             return fn.call(this, arg);
//         };
//     }

//     function prop(name) {
//         return function (object) {
//             return object[name];
//         };
//     }

//     function compose(fns, thisp) {
//         if (typeof thisp === "function" || arguments.length > 2) {
//             throw new TypeError("compose takes func|[funcs] and optional thisp object");
//         }
//         fns = seq(fns || []);
//         each(fns, function (fn) {
//             if (typeof fn != "function") {
//                 throw new TypeError("compose must receive function or an array of functions");
//             }
//         });
//         return function () {
//             var i = fns.length;
//             var result = arguments;
//             while (i--) {
//                 result = [fns[i].apply(thisp, result)];
//             }
//             return result[0];
//         };
//     }

//     function partial(fn) {
//         var args = [].slice.call(arguments, 1);
//         return function () {
//             return fn.apply(this, args.concat([].slice.call(arguments)));
//         };
//     }

//     function reversedIterator(name) {
//         return function (fn, seq) {
//             return _[name](seq, fn);
//         };
//     }

//     var map = reversedIterator("map");
//     var select = reversedIterator("filter");
//     var identity = compose();
//     var defined = function (o) { return typeof o !== "undefined" && o !== null; };
//     var seldef = partial(select, defined);

//     var mapdef = function (fn, coll) {
//         return seldef(map(fn, seldef(coll)));
//     };

//     C.fn = {
//         identity: identity,
//         defined: defined,
//         unary: unary,
//         prop: prop,
//         compose: compose,
//         partial: partial,
//         map: map,
//         select: select,
//         seldef: seldef,
//         mapdef: mapdef
//     };

//     // DOM traversal

//     function children(elements) {
//         if (isSeq(elements)) { return flatten(map(children, elements)); }
//         var results = [], child = elements.firstChild;
//         while (child) {
//             if (child.nodeType === 1) { results.push(child); }
//             child = child.nextSibling;
//         }
//         return results;
//     }

//     function id(idStr) {
//         return document.getElementById(idStr);
//     }

//     function get(selectors, parent) {
//         if (!parent) { parent = document; }
//         return uniq(reduce(seq(selectors), function (seq, selector) {
//             if (/^#/.test(selector)) {
//                 return seq.concat(id(selector.slice(1)));
//             } else if (/^\./.test(selector)) {
//                 return concat(seq, parent.getElementsByClassName(selector.slice(1)));
//             } else {
//                 return concat(seq, parent.getElementsByTagName(selector));
//             }
//         }, []));
//     }

//     // DOM manipulation

//     function remove(element) {
//         element.parentNode.removeChild(element);
//     }

//     C.dom = {
//         children: children,
//         id: id,
//         get: get,
//         remove: remove
//     };
// }(cull));
