var cull = (function (global) {
    "use strict";

    var slice = Array.prototype.slice;
    var toString = Object.prototype.toString;

    function _assert(pred, msg) {
        if (!pred) { throw new TypeError(msg); }
    }

    function _refute(pred, msg) {
        _assert(!pred, msg);
    }

    /** Is `seq` an object with a numeric length, but not a DOM element? */
    function isSeq(seq) {
        return !!seq &&
            typeof seq === "object" &&
            typeof seq.length === "number" &&
            !seq.tagName;
    }

    /** Returns a version of `value` that is an actual Array. */
    function toSeq(value) {
        if (toString.call(value) === "[object Array]") { return value; }
        if (isSeq(value)) { return slice.call(value); }
        if (typeof value === "undefined" || value === null) { return []; }
        return slice.call(arguments);
    }

    /** Calls `fn` on every item in `list`, presumably for side-effects. */
    function doall(fn, list) {
        var i, l;
        for (i = 0, l = list.length; i < l; ++i) {
            fn(list[i], i, list);
        }
    }

    /** Is `fn` a function? */
    function isFunction(fn) {
        return typeof fn === "function";
    }

    /**
     * Returns the result of applying `fn` to `initial` and the first
     * item in `list`, then applying `fn` to that result and the 2nd
     * item, etc.
     *
     * Can also be called without `initial`, in which case the first
     * invocation of `fn` will be with the first two items in `list`.
     */
    function reduce(fn, initial, list) {
        _assert(typeof fn === "function", "reducer should be a function");
        var i = 0, l, seq = list, accumulator = initial;

        if (arguments.length === 2) {
            seq = initial;
            accumulator = seq[0];
            i = 1;
        }

        if (typeof seq === "string") { seq = seq.split(""); }
        _assert(isSeq(seq), "reduce needs to work on a seq");

        for (l = seq.length; i < l; ++i) {
            accumulator = fn(accumulator, seq[i]);
        }

        return accumulator;
    }

    /** Is `pred` truthy for all items in `list`? */
    function all(pred, list) {
        var i, l;
        for (i = 0, l = list.length; i < l; ++i) {
            if (!pred(list[i])) { return false; }
        }
        return true;
    }

    /** Is `pred` truthy for any items in `list`? */
    function some(pred, list) {
        var i, l;
        for (i = 0, l = list.length; i < l; ++i) {
            if (pred(list[i])) { return true; }
        }
        return false;
    }

    /**
     * Is `pred` truthy for at least one item in `list`, and also falsy
     * for at least one item in `list`?
     */
    function onlySome(pred, list) {
        var i, l, t, f;
        for (i = 0, l = list.length; i < l; ++i) {
            if (pred(list[i])) {
                t = true;
            } else {
                f = true;
            }
            if (t && f) { return true; }
        }
        return false;
    }

    /** Returns `string` with white space at either end removed. */
    function trim(string) {
        return (string.trim && string.trim()) ||
            string.replace(/^\s+|\s+$/, "");
    }

    /** Returns `arg` unchanged. */
    function identity(arg) { return arg; }

    /** Is `o` neither undefined nor null? */
    function defined(o) { return typeof o !== "undefined" && o !== null; }

    /** Returns a version of `fn` that only accepts one argument. */
    function unary(fn) {
        return function (arg) {
            return fn.call(this, arg);
        };
    }

    /**
     * Returns a function that takes one argument and returns its
     * `name`-property.
     */
    function prop(name) {
        return function (object) {
            return object[name];
        };
    }

    /**
     * Returns a function that takes one argument and calls its
     * `name`-function with `args` (optional).
     */
    function func(name, args) {
        return function (object) {
            return object[name].apply(object, toSeq(args));
        };
    }

    /**
     * Returns a function that takes one argument and returns true if
     * it is equal to `x`.
     */
    function eq(x) {
        return function (y) { return x === y; };
    }

    var composeSignature = "compose takes func|[funcs] " +
            "and optional thisp object";

    /**
     * Returns a function that calls the last function in `fns`, then
     * calls the second to last function in `fns` with the result of
     * the first, and so on, with an optional this-binding in `thisp`.
     */
    function compose(fns, thisp) {
        _refute(isFunction(thisp) || arguments.length > 2, composeSignature);

        var _fns = toSeq(fns);

        _assert(all(isFunction, _fns), composeSignature);

        return function () {
            var i = _fns.length;
            var result = arguments;
            while (i--) {
                result = [_fns[i].apply(thisp || this, result)];
            }
            return result[0];
        };
    }

    /**
     * Takes any number of arguments, and returns a function that
     * takes one function and calls it with the arguments.
     */
    function callWith() {
        var args = arguments;
        return function (fn) {
            return fn.apply(this, args);
        };
    }

    /**
     * Takes a function `fn` and any number of additional arguments,
     * fewer than the normal arguments to `fn`, and returns a
     * function. When called, the returned function calls `fn` with
     * the given arguments first and then additional args.
     */
    function partial(fn) {
        var args = slice.call(arguments, 1);
        return function () {
            return fn.apply(this, args.concat(slice.call(arguments)));
        };
    }

    /**
     * Returns a function that calls `callee` with `obj` as this.
     * `callee` can be a function, or it can be a string - in which
     * case it will be used to look up a method on `obj`.
     *
     * Optionally takes additional arguments that are partially
     * applied.
     */
    function bind(obj, callee) {
        var fn = typeof callee === "string" ? obj[callee] : callee;
        var args = slice.call(arguments, 2);
        return function () {
            return fn.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
     * If `handlr` is a function, returns it. If `handlr` is an
     * object, returns a function that calls the `method` fn on `handlr`.
     *
     * Optionally takes additional arguments that are partially
     * applied.
     */
    function handler(handlr, method) {
        if (typeof handlr === "function") { return handlr; }
        _assert(isFunction(handlr[method]),
                "Handler has no method '" + method + "'");
        return bind.apply(null, arguments);
    }

    /** Flatten `seq` recursively and return a list of non-seq values */
    function flatten(seq) {
        _assert(isSeq(seq), "flatten expects a seq");
        var result = [], i, l;

        for (i = 0, l = seq.length; i < l; i++) {
            result = result.concat(isSeq(seq[i]) ? flatten(seq[i]) : seq[i]);
        }

        return result;
    }

    /** Return the first index of `needle` in `seq`, otherwise < 0 */
    function indexOf(needle, seq) {
        _assert(isSeq(seq), "indexOf expects a needle and a seq");
        var i, l;
        for (i = 0, l = seq.length; i < l; ++i) {
            if (needle === seq[i]) { return i; }
        }
        return -1;
    }

    /** Return a list with only the unique values in `seq` */
    function uniq(seq) {
        _assert(isSeq(seq), "uniq expects a seq");
        var result = [], i, l;

        for (i = 0, l = seq.length; i < l; ++i) {
            if (indexOf(seq[i], result) < 0) {
                result.push(seq[i]);
            }
        }

        return result;
    }

    /** Return the first item in `seq` for which `fn` returns `true` */
    function first(fn, seq) {
        _assert(isFunction(fn) && isSeq(seq),
                "first expects a function and a seq");

        var i, l;
        for (i = 0, l = seq.length; i < l; ++i) {
            if (fn(seq[i])) {
                return seq[i];
            }
        }
    }

    /** Return a new list containing the items from `seq` for which
        `fn` is `true` */
    function select(fn, seq) {
        _assert(isFunction(fn) && isSeq(seq),
                "select expects a function and a seq");
        var result = [], i, l;
        for (i = 0, l = seq.length; i < l; ++i) {
            if (fn(seq[i])) {
                result.push(seq[i]);
            }
        }
        return result;
    }

    /** Return a list of properties present in `seq` but not in `other` */
    function difference(seq, other) {
        _assert(isSeq(seq) && isSeq(other), "difference expects two seqs");
        return select(function (value) {
            return indexOf(value, other) < 0;
        }, seq);
    }

    /** Return a list of enumerable own property keys in `object` */
    function keys(object) {
        var prop, result = [];
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                result.push(prop);
            }
        }
        return result;
    }

    /** Return a list of enumerable own property values in `object` */
    function values(object) {
        var prop, result = [];
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                result.push(object[prop]);
            }
        }
        return result;
    }

    /** Return a list of non-{null, undefined} items in `seq` */
    var seldef = partial(select, defined);

    /**
     * Returns a new list consisting of the result of applying `fn` to
     * the items in `list`.
     */
    function map(fn, list) {
        var result = [], i, l;
        for (i = 0, l = list.length; i < l; i++) {
            result.push(fn(list[i]));
        }
        return result;
    }

    /**
     * Returns the complement of `pred`, ie a function that returns true
     * when `pred` would be falsy, and false when `pred` would be truthy.
     */
    function negate(pred) {
        return function () {
            return !pred.apply(this, arguments);
        };
    }

    /**
     * Returns a new list of the items in `list` for which `pred`
     * returns nil.
     */
    function reject(pred, list) {
        return select(negate(pred), list);
    }

    /**
     * Returns a new list with the concatenation of the elements in
     * `list1` and `list2`.
     */
    function concat(list1, list2) {
        return toSeq(list1).concat(toSeq(list2));
    }

    /**
     * Returns a new list with the items in `list` grouped into
     * `n-`sized sublists.
     *
     * The last group may contain less than `n` items.
     */
    function partition(n, list) {
        var result = [], i, l;
        for (i = 0, l = list.length; i < l; i += n) {
            result.push(list.slice(i, i + n));
        }
        return result;
    }

    /**
     * Returns a new list consisting of the result of applying `fn` to
     * the items in `list`, but filtering out all null or undefined
     * values from both `list` and the resulting list.
     */
    function mapdef(fn, list) {
        return seldef(map(fn, seldef(list)));
    }

    /**
     * Returns the result of applying concat to the result of applying
     * map to `fn` and `list`. Thus function `fn` should return a
     * collection.
     */
    function mapcat(fn, list) {
        return reduce(concat, map(fn, list));
    }

    /**
     * Returns a new list of all elements in `list` separated by
     * `sep`.
     */
    function interpose(sep, list) {
        var result = [], i, l;
        for (i = 0, l = list.length; i < l; i += 1) {
            result.push(list[i]);
            if (i < l - 1) {
                result.push(sep);
            }
        }
        return result;
    }

    // cull.advice

    /**
     * Advices the method `name` on `obj`, calling `fn` after the
     * method is called. `fn` is called with the return value of the
     * method as its first argument, then the methods original
     * arguments. If `fn` returns anything, it will override the
     * return value of the method.
     */
    function after(obj, name, fn) {
        var originalFn = obj[name];
        obj[name] = function () {
            var ret1 = originalFn.apply(this, arguments);
            var ret2 = fn.apply(this, [ret1].concat(slice.call(arguments)));
            return typeof ret2 !== "undefined" ? ret2 : ret1;
        };
    }

    /**
     * Advices the method `name` on `obj`, calling `fn` before the
     * method is called. `fn` is called with the same arguments as the
     * method.
     */
    function before(obj, name, fn) {
        var originalFn = obj[name];
        obj[name] = function () {
            fn.apply(this, arguments);
            return originalFn.apply(this, arguments);
        };
    }

    /**
     * Advices the method `name` on `obj`, calling `fn` instead of the
     * method. `fn` receives the original method as its first
     * argument, and then the methods original arguments. It is up to
     * the advicing function if and how the original method is called.
     */
    function around(obj, name, fn) {
        var f = partial(fn, obj[name]);
        obj[name] = function () {
            return f.apply(this, arguments);
        };
    }

    // cull.dom

    var dom;

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

        // Implementation from jQuery/Sizzle. Simplified.
        function text(el) {
            _assert(typeof el !== "undefined" &&
                    typeof el.nodeType === "number",
                    "text() expects DOM element");
            var nodeType = el.nodeType;

            if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                // Use textContent for elements
                // innerText usage removed for consistency of new lines
                // (see jQuery #11153)
                if (typeof el.textContent === "string") {
                    return el.textContent;
                }
                var ret = "";
                for (el = el.firstChild; el; el = el.nextSibling) {
                    ret += text(el);
                }
                return ret;
            }
            if (nodeType === 3 || nodeType === 4) {
                return el.nodeValue;
            }
            return "";
        }

        function frag(items) {
            var fragment = document.createDocumentFragment();
            doall(bind(fragment, "appendChild"), toSeq(items));
            return fragment;
        }

        dom = {
            hasClassName: hasClassName,
            children: children,
            id: id,
            get: get,
            remove: remove,
            frag: frag,
            text: text,
            cn: {
                has: hasClassName,
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

        function setData(data, element) {
            var name;
            data = data || {};

            for (name in data) {
                if (data.hasOwnProperty(name)) {
                    element.setAttribute("data-" + name, data[name]);
                    element["data-" + name] = data[name];
                }
            }
        }

        function getData(property, element) {
            return element.getAttribute("data-" + property);
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
            },

            data: function (el, data) {
                setData(data, el);
            }
        };

        doall(function (tagName) { el[tagName] = partial(el, tagName); }, [
            "a", "br", "div", "fieldset", "form", "h2", "h3", "h4",
            "h5", "img", "input", "label", "li", "p", "span", "strong",
            "textarea", "ul", "span", "select", "option", "ol", "iframe",
            "table", "tr", "td", "pre", "button", "i"
        ]);

        el.setProp = setProp;
        el.data = { get: getData, set: setData };
        el.append = append;
        el.content = content;
        dom.el = el;
    }());

    /** docs:function-list */
    return {
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
        defined: defined,
        unary: unary,
        prop: prop,
        func: func,
        eq: eq,
        compose: compose,
        callWith: callWith,
        partial: partial,
        bind: bind,
        handler: handler,
        keys: keys,
        values: values,
        concat: concat,
        flatten: flatten,
        uniq: uniq,
        first: first,
        select: select,
        negate: negate,
        reject: reject,
        seldef: seldef,
        map: map,
        mapdef: mapdef,
        mapcat: mapcat,
        partition: partition,
        difference: difference,
        interpose: interpose,
        indexOf: indexOf,
        after: after,
        before: before,
        around: around,
        dom: dom
    };
}(this));

if (typeof require === "function" && typeof module !== "undefined") {
    module.exports = cull;
}
