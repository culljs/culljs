if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

var assert = buster.assert;
var refute = buster.refute;

function isEven(n) { return n % 2 === 0; }
function square(n) { return n * n; }

(function () {
    "use strict";

    var setupAdvice = function () {
        this.obj = {
            list: [],
            fn: function (x, y) {
                this.list.push(x);
                return y - 1;
            }
        };
    };

    buster.testCase("cull", {
        "isList": {
            "example": function () {
                assert(cull.isList([]));
                refute(cull.isList({}));
                assert(cull.isList({ length: 4 }));
                refute(cull.isList({ length: 4, tagName: "DIV" }));
            }
        },

        "reduce": {
            "list": function () {
                var list = [1, 2, 3, 4];
                var add = function (a, b) { return a + b; };
                assert.equals(cull.reduce(add, list), 10);
                assert.equals(cull.reduce(add, 5, list), 15);
            },

            "string": function () {
                var list = "1234";

                var add = function (a, b) {
                    return Number(a) + Number(b);
                };

                assert.equals(cull.reduce(add, list), 10);
                assert.equals(cull.reduce(add, 5, list), 15);
            }
        },

        "flatten": {
            "returns flat array unchanged": function () {
                assert.equals(cull.flatten([1, 2, 3, 4]), [1, 2, 3, 4]);
            },

            "flattens nested array": function () {
                assert.equals(cull.flatten([1, [2], 3, 4]), [1, 2, 3, 4]);
            },

            "flattens deeply nested array": function () {
                var arr = [1, [2, [3, 4], 5], 6];
                assert.equals(cull.flatten(arr), [1, 2, 3, 4, 5, 6]);
            }
        },

        "uniq": {
            "returns array of unique elements untouched": function () {
                assert.equals(cull.uniq([1, 2, 3, 4]), [1, 2, 3, 4]);
            },

            "rejects duplicates": function () {
                var arr = [1, 1, "Hey", { id: 42 }, "Hey", 2];
                assert.equals(cull.uniq(arr), [1, "Hey", { id: 42 }, 2]);
            },

            "rejects duplicates by identity": function () {
                var obj = { id: 42 };
                var arr = [obj, { id: 42 }, 42, obj];
                assert.equals(cull.uniq(arr), [{ id: 42 }, { id: 42 }, 42]);
            }
        },

        "toList": {
            "example": function () {
                assert.equals(cull.toList(1), [1]);
                assert.equals(cull.toList(null), []);
                assert.equals(cull.toList(undefined), []);

                var args = function () { return arguments; };
                assert.isArray(cull.toList(args(1, 2, 3)));
            },

            "returns array unmodified": function () {
                var arr = [1, 2, 3];
                assert.same(cull.toList(arr), arr);
            },

            "returns empty array for null": function () {
                assert.equals(cull.toList(null), []);
            },

            "returns empty array for missing argument": function () {
                assert.equals(cull.toList(), []);
            },

            "returns empty array for undefined": function () {
                assert.equals(cull.toList(undefined), []);
            },

            "returns scalar as array": function () {
                assert.equals(cull.toList(1), [1]);
            },

            "returns arguments as true array": function () {
                var args = function () { return arguments; };
                assert.isArray(cull.toList(args(1, 2, 3)));
            },

            "returns array w/ one element for object with length": function () {
                var obj = { length: 3};
                var arr = cull.toList(obj);
                assert.equals(arr[0], obj);
                assert.equals(arr.length, 1);
            }
        },

        "doall": {
            "example": function () {
                var result = [];
                cull.doall(function (item) {
                    result.unshift(square(item));
                }, [1, 2, 3, 4]);
                assert.equals(result, [16, 9, 4, 1]);
            },

            "returns list": function () {
                var input = [1, 2, 3, 4];
                assert.same(input, cull.doall(this.spy(), input));
            }
        },

        "isFunction": {
            "example": function () {
                assert(cull.isFunction(function () {}));
                assert(cull.isFunction(square));
                refute(cull.isFunction({}));
            }
        },

        "trim": {
            "example": function () {
                assert.equals(cull.trim("  abc  "), "abc");
                assert.equals(cull.trim("  abc  def  "), "abc  def");
            }
        },

        "defined": {
            "example": function () {
                assert(cull.defined({}));
                refute(cull.defined(null));
                refute(cull.defined(undefined));
            }
        },

        "unary": {
            "example": function () {
                var add = function (a, b) { return a + b; };
                assert.isNaN(cull.unary(add)(2, 3));
            }
        },

        "identity": {
            "example": function () {
                assert.equals(cull.identity(4), 4);
            },

            "returns first argument": function () {
                assert.equals(cull.identity(4, 2), 4);
            },

            "returns null": function () {
                assert.equals(cull.identity(null), null);
            },

            "returns undefined without arguments": function () {
                assert.equals(cull.identity(), undefined);
            }
        },

        "all": {
            "example": function () {
                refute(cull.all(isEven, [1, 2, 3, 4]));
                assert(cull.all(isEven, [2, 4, 6, 8]));
            },

            "is true for all truthy values": function () {
                assert(cull.all(cull.identity, [1, 2, 3, 4]));
            },

            "is false when some are falsy": function () {
                refute(cull.all(cull.identity, [1, 2, 3, 0]));
            }
        },

        "some": {
            "example": function () {
                assert(cull.some(isEven, [1, 2, 3, 4]));
                refute(cull.some(isEven, [1, 3, 5, 7]));
            },

            "is true for some truthy values": function () {
                assert(cull.some(cull.identity, [1, 0, 3, 0]));
            },

            "is false for all falsy values": function () {
                refute(cull.some(cull.identity, [0, 0, 0, 0]));
            }
        },

        "onlySome": {
            "example": function () {
                assert(cull.onlySome(isEven, [1, 2, 3, 4]));
                refute(cull.onlySome(isEven, [2, 4, 6, 8]));
                refute(cull.onlySome(isEven, [1, 3, 5, 7]));
            },

            "is true when there is a mix": function () {
                assert(cull.onlySome(cull.identity, [1, 0, 1]));
            },

            "is false when none match": function () {
                refute(cull.onlySome(cull.identity, [0, 0, 0]));
            },

            "is false when all match": function () {
                refute(cull.onlySome(cull.identity, [1, 1, 1]));
            }
        },

        "prop": {
            "example": function () {
                var persons = [
                    { firstName: "John", age: 23 },
                    { firstName: "Suzy", age: 27 },
                    { firstName: "Peter", age: 35 }
                ];

                assert.equals(cull.map(cull.prop("firstName"), persons),
                              ["John", "Suzy", "Peter"]);

                assert.equals(cull.map(cull.prop("age"), persons),
                              [23, 27, 35]);
            },

            "returns named property from object": function () {
                assert.equals(cull.prop("id")({ id: 42 }), 42);
            },

            "returns undefined when property does not exist": function () {
                refute.defined(cull.prop("id")(42));
            }
        },

        "func": {
            "calls named method on object": function () {
                var f = cull.func("getId");
                var obj = { getId: function () { return 42; } };
                assert.equals(42, f(obj));
            },

            "calls with given argument": function () {
                var f = cull.func("setName", "Maria");
                var obj = { setName: this.spy() };

                f(obj);

                assert.calledOnceWith(obj.setName, "Maria");
            },

            "calls with given arguments": function () {
                var f = cull.func("setName", ["Maria", "Perke"]);
                var obj = { setName: this.spy() };

                f(obj);

                assert.calledOnceWith(obj.setName, "Maria", "Perke");
            }
        },

        "eq": {
            "creates a function to check for equality": function () {
                var isFive = cull.eq(5);
                assert(isFive(5));
                refute(isFive("5"));
            }
        },

        "compose": {
            "creates identity functions without input": function () {
                var identity = cull.compose();
                assert.equals(identity(2, 3), 2);
            },

            "throws for non-function argument": function () {
                assert.exception(function () {
                    cull.compose("Oops");
                });
            },

            "throws for non-function argument in array": function () {
                assert.exception(function () {
                    cull.compose([function () {}, "Oops"]);
                });
            },

            "throws for two function arguments": function () {
                assert.exception(function () {
                    cull.compose(function () {}, function () {});
                });
            },

            "throws for more than two arguments": function () {
                assert.exception(function () {
                    cull.compose(function () {}, {}, function () {});
                });
            },

            "calls both composed functions": function () {
                var spies = [this.spy(), this.spy()];
                var func = cull.compose(spies);
                func();

                assert.called(spies[0]);
                assert.called(spies[1]);
            },

            "calls composed functions in 'reverse' order": function () {
                var spies = [this.spy(), this.spy()];
                var func = cull.compose(spies);
                func();

                assert.callOrder(spies[1], spies[0]);
            },

            "calls first function with function arguments": function () {
                var spies = [this.spy(), this.spy()];
                var func = cull.compose(spies);
                func(2, 3, 4);

                assert.calledWith(spies[1], 2, 3, 4);
            },

            "calls second function with return value from first": function () {
                var spies = [this.spy(), this.stub().returns(42)];
                var func = cull.compose(spies);
                func();

                assert.calledWith(spies[0], 42);
            },

            "returns result of last function": function () {
                var spies = [this.stub().returns(13), this.spy()];
                var func = cull.compose(spies);

                assert.equals(func(), 13);
            },

            "composes two rather ordinary functions": function () {
                var fn = function (a) { return a - 4; };
                var fi = cull.partial(cull.select, cull.identity);
                var composed = cull.compose([fi, cull.map]);

                assert.equals(composed(fn, [4, 5, 6, 7]), [1, 2, 3]);
            },

            "as method calls all functions with correct this": function () {
                var fns = [this.spy(), this.spy()];
                var object = { method: cull.compose(fns) };
                object.method();

                assert.calledOn(fns[0], object);
                assert.calledOn(fns[1], object);
            }
        },

        "callWith": {
            "returns a fn that takes a fn and calls it with args": function () {
                var add = function (a, b) { return a + b; };
                var fn = cull.callWith(1, 2);
                assert.equals(fn(add), 3);
            }
        },

        "partial": {
            "schönfinkelizes": function () {
                var fn = function (a, b) { return a + b; };
                var curried = cull.partial(fn, 3);
                assert.equals(curried(5), 8);
            },

            "passes partial arguments before actual arguments": function () {
                var fn = function (a, b) { return a - b; };
                var partial = cull.partial(fn, 5);
                assert.equals(partial(2), 3);
            },

            "binds select transform": function () {
                var fi = cull.partial(cull.select, cull.identity);
                assert.equals(fi([0, 1, 2]), [1, 2]);
            }
        },

        "bind": {
            "calls function with bound this object": function () {
                var func = this.spy();
                var obj = {};
                var bound = cull.bind(obj, func);

                bound();
                assert.equals(func.thisValues[0], obj);

                bound.call({});
                assert.equals(func.thisValues[1], obj);

                bound.apply({});
                assert.equals(func.thisValues[2], obj);
            },

            "calls method with bound this object": function () {
                var obj = { meth: this.spy() };
                var bound = cull.bind(obj, "meth");

                bound();
                assert.equals(obj.meth.thisValues[0], obj);

                bound.call({});
                assert.equals(obj.meth.thisValues[1], obj);

                bound.apply({});
                assert.equals(obj.meth.thisValues[2], obj);
            },

            "calls function with bound arguments": function () {
                var func = this.spy();
                var obj = {};
                var bound = cull.bind(obj, func, 42, "Hey");

                bound();

                assert(func.calledWith(42, "Hey"));
            },

            "calls function with bound args and passed args": function () {
                var func = this.spy();
                var obj = {};
                var bound = cull.bind(obj, func, 42, "Hey");

                bound("Bound", []);
                assert(func.calledWith(42, "Hey", "Bound", []));

                bound.call(null, ".call", []);
                assert(func.calledWith(42, "Hey", ".call", []));

                bound.apply(null, [".apply", []]);
                assert(func.calledWith(42, "Hey", ".apply", []));
            }
        },

        "concat": {
            "concatenates lists": function () {
                var a = [1, 2, 3];
                var b = [4, 5, 6];
                assert.equals(cull.concat(a, b), [1, 2, 3, 4, 5, 6]);
            },

            "doesn't mutate original lists": function () {
                var a = [1, 2, 3];
                var b = [4, 5, 6];
                cull.concat(a, b);
                assert.equals(a, [1, 2, 3]);
                assert.equals(b, [4, 5, 6]);
            },

            "concatenates arguments": function () {
                var args = function () { return arguments; };
                var a = args(1, 2, 3);
                var b = args(4, 5, 6);
                assert.equals(cull.concat(a, b), [1, 2, 3, 4, 5, 6]);
            }
        },

        "map": {
            "squares numbers": function () {
                var square = function (num) { return num * num; };
                assert.equals(cull.map(square, [1, 2, 3]), [1, 4, 9]);
            },

            "passes only item": function () {
                refute.exception(function () {
                    cull.map(function () {
                        if (arguments.length !== 1) { throw new Error("fail"); }
                    }, [1, 2, 3]);
                });
            }
        },

        "mapcat": {
            "concatenates the results of map": function () {
                var dbl = function (single) { return [single, single]; };
                assert.equals(
                    cull.mapcat(dbl, [1, 2, 3]),
                    [1, 1, 2, 2, 3, 3]
                );
            },

            "handles empty lists properly": function () {
                var dbl = function (single) { return [single, single]; };
                assert.equals(cull.mapcat(dbl, []), []);
            }
        },

        "zipmap": {
            "creates a map out of two lists": function () {
                var keys = ["a", "b", "c"];
                var vals = [1, 2, 3];
                assert.equals(cull.zipmap(keys, vals),
                              {"a": 1, "b": 2, "c": 3});
            },

            "discards extra keys": function () {
                var keys = ["a", "b", "c", "d"];
                var vals = [1, 2, 3];
                assert.equals(cull.zipmap(keys, vals),
                              {"a": 1, "b": 2, "c": 3});
            },

            "discards extra vals": function () {
                var keys = ["a", "b", "c"];
                var vals = [1, 2, 3, 4];
                assert.equals(cull.zipmap(keys, vals),
                              {"a": 1, "b": 2, "c": 3});
            }
        },

        "first": {
            "finds the first matching element in a list": function () {
                var items = [1, 2, 3, 4];
                var even = function (i) { return i % 2 === 0; };
                assert.equals(cull.first(even, items), 2);
            }
        },

        "select": {
            "with identity removes falsy values": function () {
                var items = [0, 1, 2, null, 3, 4, undefined, 5, 6];
                var result = cull.select(function (i) { return !!i; }, items);
                assert.equals(result, [1, 2, 3, 4, 5, 6]);
            }
        },

        "negate": {
            "example": function () {
                var isOdd = cull.negate(isEven);
                assert(isOdd(5));
            }
        },

        "reject": {
            "keep only elements that does not match predicate": function () {
                var items = [1, 2, 3, 4, 5];
                var odd = function (n) { return n % 2; };
                assert.equals(cull.reject(odd, items), [2, 4]);
            }
        },

        "mapdef": {
            setUp: function () {
                this.list = [
                    { id: 1 },
                    { id: 2 },
                    { different: false },
                    { id: 3 }
                ];
            },

            "excludes undefineds from result": function () {
                var fn = cull.prop("id");
                assert.equals(cull.mapdef(fn, this.list), [1, 2, 3]);
            },

            "excludes nulls from result": function () {
                this.list[2].id = null;
                var fn = cull.prop("id");
                assert.equals(cull.mapdef(fn, this.list), [1, 2, 3]);
            },

            "does not exclude zeroes from result": function () {
                this.list[2].id = 0;
                var fn = cull.prop("id");
                assert.equals(cull.mapdef(fn, this.list), [1, 2, 0, 3]);
            },

            "does not call fn with undefined values": function () {
                this.list[2] = null;
                var fn = cull.prop("id");
                assert.equals(cull.mapdef(fn, this.list), [1, 2, 3]);
            }
        },

        "partition": {
            "splits a listuence into n-sized chunks": function () {
                var n = 2;
                var result = cull.partition(n, [1, 2]);
                assert.equals(result, [[1, 2]]);
            },

            "splits a longer listuence": function () {
                var result = cull.partition(2, [1, 2, 3, 4]);
                assert.equals(result, [[1, 2], [3, 4]]);
            },

            "splits into larger chunks": function () {
                var result = cull.partition(3, [1, 2, 3, 4, 5, 6]);
                assert.equals(result, [[1, 2, 3], [4, 5, 6]]);
            },

            "keeps incomplete partitions": function () {
                var result = cull.partition(2, [1, 2, 3, 4, 5]);
                assert.equals(result, [[1, 2], [3, 4], [5]]);
            }
        },

        "indexOf": {
            "finds the index of an item": function () {
                assert.equals(1, cull.indexOf("b", ["a", "b", "c"]));
            }
        },

        "difference": {
            "subtracts one array from the other": function () {
                var result = cull.difference([1, 2, 3, 4], [2, 3]);
                assert.equals(result, [1, 4]);
            }
        },

        "intersection": {
            "keeps elements that are in both arrays": function () {
                var result = cull.intersection([1, 2, 3, 4], [2, 3, 5]);
                assert.equals(result, [2, 3]);
            }
        },

        "interpose": {
            "returns list with elements in coll separated by sep": function () {
                var result = cull.interpose(":", [1, 2, 3]);
                assert.equals(result, [1, ":", 2, ":", 3]);
            },

            "does nothing for empty or single element arrays": function () {
                assert.equals(cull.interpose(":", []), []);
                assert.equals(cull.interpose(":", [1]), [1]);
            }
        },

        "keys": {
            "returns enumerable keys of object": function () {
                assert.equals(cull.keys({
                    id: 1,
                    num: 42,
                    name: "Mr"
                }), ["id", "num", "name"]);
            }
        },

        "values": {
            "returns enumerable values of object": function () {
                assert.equals(cull.values({
                    id: 1,
                    num: 42,
                    name: "Mr"
                }), [1, 42, "Mr"]);
            }
        },

        "after": {
            setUp: setupAdvice,

            "runs after the original function": function () {
                cull.after(this.obj, "fn", function (ret, x) {
                    this.list.push(ret * x);
                });

                this.obj.fn(3, 2);

                assert.equals(this.obj.list, [3, 3]);
            },

            "returns value from original function": function () {
                cull.after(this.obj, "fn", function (ret, x) {
                    this.list.push(ret * x);
                });

                assert.equals(this.obj.fn(3, 7), 6);
            },

            "returns new value if given": function () {
                cull.after(this.obj, "fn", function (ret, x) {
                    this.list.push(ret * x);
                    return false;
                });

                assert.equals(this.obj.fn(3, 7), false);
            },

            "runs in same this-context": function () {
                var list = ["other"];
                cull.after(this.obj, "fn", function () {
                    this.list.push("after");
                });

                this.obj.fn.call({ list: list }, "x", "y");

                assert.equals(list, ["other", "x", "after"]);
            }
        },

        "before": {
            setUp: function () {
                setupAdvice.call(this);
                cull.before(this.obj, "fn", function (x) {
                    this.list.push(x - 1);
                });
            },

            "runs after the original function": function () {
                this.obj.fn(3);
                assert.equals(this.obj.list, [2, 3]);
            },

            "returns value from original function": function () {
                assert.equals(this.obj.fn(3, 7), 6);
            },

            "runs in same this-context": function () {
                var list = [42];
                this.obj.fn.call({ list: list }, 3);
                assert.equals(list, [42, 2, 3]);
            }
        },

        "around": {
            setUp: setupAdvice,

            "must call the original function itself": function () {
                cull.around(this.obj, "fn", function () {});
                this.obj.fn(3);
                assert.equals(this.obj.list, []);
            },

            "can call the original function itself": function () {
                cull.around(this.obj, "fn", function (orig, x, y) {
                    orig.call(this, x + 6);
                });
                this.obj.fn(3);
                assert.equals(this.obj.list, [9]);
            },

            "uses new return value": function () {
                cull.around(this.obj, "fn", function (orig, x, y) {
                    return x + orig.call(this, x, y);
                });
                assert.equals(this.obj.fn(3, 7), 9);
            }
        }

    });
}());
