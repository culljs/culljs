var cull = (function (global) {
    "use strict";

    var _ = global._ || require("underscore");
    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;

    function _assert(pred, msg) {
        if (!pred) { throw new TypeError(msg); }
    }

    function _refute(pred, msg) {
        _assert(!pred, msg);
    }

    function isSeq(seq) {
        return !!seq &&
            typeof seq === "object" &&
            typeof seq.length === "number" &&
            !seq.tagName;
    }

    function toSeq(value) {
        if (toString.call(value) === "[object Array]") { return value; }
        if (isSeq(value)) { return slice.call(value); }
        if (typeof value === "undefined" || value === null) { return []; }
        return slice.call(arguments);
    }

    function doall(fn, seq) {
        var i, l;
        for (i = 0, l = seq.length; i < l; ++i) {
            fn(seq[i], i, seq);
        }
    }

    function isFunction(fn) {
        return typeof fn === "function";
    }

    function reduce(fn, initial, seq) {
        if (arguments.length === 3) {
            return _.reduce(seq, fn, initial);
        }
        return _.reduce(initial, fn);
    }

    function all(fn, seq) {
        var i, l;
        for (i = 0, l = seq.length; i < l; ++i) {
            if (!fn(seq[i])) { return false; }
        }
        return true;
    }

    function some(fn, seq) {
        var i, l;
        for (i = 0, l = seq.length; i < l; ++i) {
            if (fn(seq[i])) { return true; }
        }
        return false;
    }

    function onlySome(fn, seq) {
        var i, l, t, f;
        for (i = 0, l = seq.length; i < l; ++i) {
            if (fn(seq[i])) {
                t = true;
            } else {
                f = true;
            }
            if (t && f) { return true; }
        }
        return false;
    }

    function trim(string) {
        return (string.trim && string.trim()) ||
            string.replace(/^\s+|\s+$/, "");
    }

    function identity(arg) { return arg; }

    function defined(o) { return typeof o !== "undefined" && o !== null; }

    cull = {
        _assert: _assert,
        _refute: _refute,
        trim: trim,
        doall: doall,
        reduce: reduce,
        all: all,
        some: some,
        onlySome: onlySome,
        isFunction: isFunction,
        isSeq: isSeq,
        toSeq: toSeq,
        identity: identity,
        defined: defined
    };

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

    function func(name, args) {
        return function (object) {
            return object[name].apply(object, toSeq(args));
        };
    }

    function eq(one) {
        return function (other) { return one === other; };
    }

    var composeSignature = "compose takes func|[funcs] " +
            "and optional thisp object";

    function compose(funcs, thisp) {
        _refute(isFunction(thisp) || arguments.length > 2, composeSignature);

        var fns = toSeq(funcs);

        _assert(all(isFunction, fns), composeSignature);

        return function () {
            var i = fns.length;
            var result = arguments;
            while (i--) {
                result = [fns[i].apply(thisp || this, result)];
            }
            return result[0];
        };
    }

    function callWith() {
        var args = arguments;
        return function (fn) {
            return fn.apply(this, args);
        };
    }

    function partial(fn) {
        var args = slice.call(arguments, 1);
        return function () {
            return fn.apply(this, args.concat(slice.call(arguments)));
        };
    }

    function bind(obj, methOrProp) {
        var fn = typeof methOrProp === "string" ? obj[methOrProp] : methOrProp;
        var args = slice.call(arguments, 2);
        return function () {
            return fn.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    function handler(handlr, type) {
        if (typeof handlr === "function") { return handlr; }
        _assert(isFunction(handlr[type]),
                "Handler has no method '" + type + "'");
        return bind.apply(null, arguments);
    }

    cull.unary = unary;
    cull.prop = prop;
    cull.func = func;
    cull.eq = eq;
    cull.compose = compose;
    cull.callWith = callWith;
    cull.partial = partial;
    cull.bind = bind;
    cull.handler = handler;
    cull.keys = _.keys;
    cull.values = _.values;

    var switchArgs = function (obj, name) {
        return function (fn, seq) {
            var args = [seq, fn].concat(slice.call(arguments, 2));
            return obj[name].apply(obj, args);
        };
    };

    var flatten = _.flatten;
    var uniq = _.uniq;
    var first = switchArgs(_, "find");
    var select = switchArgs(_, "filter");
    var indexOf = switchArgs(_, "indexOf");
    var difference = _.difference;
    var seldef = partial(select, defined);

    function map(fn, coll) {
        var result = [], i, l;
        for (i = 0, l = coll.length; i < l; i++) {
            result.push(fn(coll[i]));
        }
        return result;
    }

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

    function interpose(sep, coll) {
        var result = [], i, l;
        for (i = 0, l = coll.length; i < l; i += 1) {
            result.push(coll[i]);
            if (i < l - 1) {
                result.push(sep);
            }
        }
        return result;
    }

    cull.concat = concat;
    cull.flatten = flatten;
    cull.uniq = uniq;
    cull.first = first;
    cull.select = select;
    cull.reject = reject;
    cull.seldef = seldef;
    cull.map = map;
    cull.doall = doall;
    cull.mapdef = mapdef;
    cull.mapcat = mapcat;
    cull.partition = partition;
    cull.difference = difference;
    cull.interpose = interpose;
    cull.indexOf = indexOf;

    // cull.advice

    function after(obj, name, fn) {
        var originalFn = obj[name];
        obj[name] = function () {
            var ret1 = originalFn.apply(this, arguments);
            var ret2 = fn.apply(this, [ret1].concat(slice.call(arguments)));
            return typeof ret2 !== "undefined" ? ret2 : ret1;
        };
    }

    function before(obj, name, fn) {
        var originalFn = obj[name];
        obj[name] = function () {
            fn.apply(this, arguments);
            return originalFn.apply(this, arguments);
        };
    }

    function around(obj, name, fn) {
        var f = partial(fn, obj[name]);
        obj[name] = function () {
            return f.apply(this, arguments);
        };
    }

    cull.after = after;
    cull.before = before;
    cull.around = around;

    // cull.dom

    (function () {
        function children(elements) {
            if (isSeq(elements)) { return flatten(map(children, elements)); }
            var results = [], child = elements.firstChild;
            while (child) {
                if (child.nodeType === 1) { results.push(child); }
                child = child.nextSibling;
            }
            return results;
        }

        function id(idStr) {
            return document.getElementById(idStr);
        }

        function get(selectors, parent) {
            if (!parent) { parent = document; }
            var select = function (seq, selector) {
                if (/^#/.test(selector)) {
                    return seq.concat(id(selector.slice(1)));
                } else if (/^\./.test(selector)) {
                    var cn = selector.slice(1);
                    return concat(seq, parent.getElementsByClassName(cn));
                } else {
                    return concat(seq, parent.getElementsByTagName(selector));
                }
            };
            return uniq(reduce(select, [], toSeq(selectors)));
        }

        function remove(element) {
            element.parentNode.removeChild(element);
        }

        function hasClassName(className, element) {
            var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
            return regexp.test(element.className);
        }

        function addClassName(cn, element) {
            if (isSeq(element)) {
                return doall(partial(addClassName, cn), element);
            }
            if (hasClassName(cn, element)) { return; }
            element.className = trim(element.className + " " + cn);
        }

        function removeClassName(cn, element) {
            if (isSeq(element)) {
                return doall(partial(removeClassName, cn), element);
            }
            if (!hasClassName(cn, element)) { return; }
            var regexp = new RegExp("(^|\\s)" + cn + "(\\s|$)");
            element.className = trim(element.className.replace(regexp, " "));
        }

        function frag(items) {
            var fragment = document.createDocumentFragment();
            doall(bind(fragment, "appendChild"), toSeq(items));
            return fragment;
        }

        cull.dom = {
            hasClassName: hasClassName,
            children: children,
            id: id,
            get: get,
            remove: remove,
            frag: frag,
            cn: {
                add: addClassName,
                rm: removeClassName
            }
        };

        var el;

        var isContent = function (content) {
            return content !== null && typeof content !== "undefined" &&
                (typeof content.nodeType !== "undefined" ||
                 typeof content === "string" ||
                 isSeq(content));
        };

        function setProp(properties, element) {
            var name, mapper;
            properties = properties || {};

            for (name in properties) {
                if (properties.hasOwnProperty(name)) {
                    mapper = el.propmap[name];
                    if (mapper) {
                        mapper(element, properties[name]);
                    } else {
                        element[name] = properties[name];
                    }
                }
            }
        }

        function append(content, element) {
            _assert(isContent(content),
                    "Content should be one or a list of [string, DOM element]");
            content = toSeq(content);
            var i, l;
            for (i = 0, l = content.length; i < l; ++i) {
                if (typeof content[i] === "string") {
                    element.appendChild(document.createTextNode(content[i]));
                } else {
                    element.appendChild(content[i]);
                }
            }
        }

        function content(children, element) {
            _assert(element && typeof element.innerHTML !== "undefined",
                    "content() needs element");
            element.innerHTML = "";
            append(children, element);
        }

        el = function (tagName, attrProps, content) {
            _refute(arguments.length > 3,
                    "Content should be one or a list of [string, DOM element]");
            if (!content && isContent(attrProps)) {
                return el(tagName, {}, attrProps);
            }
            _refute(attrProps && attrProps.tagName,
                    "Cannot set attribute property tagName. Use a list when " +
                    "adding multiple content elements.");
            var element = document.createElement(tagName);
            setProp(attrProps, element);
            append(content || [], element);
            return element;
        };

        el.toString = function () {
            return "cull.dom.el()";
        };

        el.propmap = {
            style: function (el, styles) {
                var property;
                for (property in styles) {
                    if (styles.hasOwnProperty(property)) {
                        el.style[property] = styles[property];
                    }
                }
            }
        };

        doall(function (tagName) { el[tagName] = partial(el, tagName); }, [
            "a", "br", "div", "fieldset", "form", "h2", "h3", "h4",
            "h5", "img", "input", "label", "li", "p", "span", "strong",
            "textarea", "ul", "span", "select", "option", "ol", "iframe",
            "table", "tr", "td", "pre", "button"
        ]);

        el.setProp = setProp;
        el.append = append;
        el.content = content;
        cull.dom.el = el;

    }());

    return cull;
}(this));

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull;
}
