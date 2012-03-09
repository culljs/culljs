if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";
    var F = cull.fn;
    var seq = cull.seq;

    buster.testCase("cull.fn", {
        "unary": {

        },

        "prop": {
            "returns named property from object": function () {
                assert.equals(F.prop("id")({ id: 42 }), 42);
            },

            "returns undefined when property does not exist": function () {
                refute.defined(F.prop("id")(42));
            }
        },

        "compose": {
            "creates identity functions without input": function () {
                var identity = F.compose();
                assert.equals(identity(2, 3), 2);
            },

            "throws for non-function argument": function () {
                assert.exception(function () {
                    F.compose("Oops");
                });
            },

            "throws for non-function argument in array": function () {
                assert.exception(function () {
                    F.compose([function () {}, "Oops"]);
                });
            },

            "throws for two function arguments": function () {
                assert.exception(function () {
                    F.compose(function () {}, function () {});
                });
            },

            "throws for more than two arguments": function () {
                assert.exception(function () {
                    F.compose(function () {}, {}, function () {});
                });
            },

            "calls both composed functions": function () {
                var spies = [this.spy(), this.spy()];
                var func = F.compose(spies);
                func();

                assert.called(spies[0]);
                assert.called(spies[1]);
            },

            "calls composed functions in 'reverse' order": function () {
                var spies = [this.spy(), this.spy()];
                var func = F.compose(spies);
                func();

                assert.callOrder(spies[1], spies[0]);
            },

            "calls first function with function arguments": function () {
                var spies = [this.spy(), this.spy()];
                var func = F.compose(spies);
                func(2, 3, 4);

                assert.calledWith(spies[1], 2, 3, 4);
            },

            "calls second function with return value from first": function () {
                var spies = [this.spy(), this.stub().returns(42)];
                var func = F.compose(spies);
                func();

                assert.calledWith(spies[0], 42);
            },

            "returns result of last function": function () {
                var spies = [this.stub().returns(13), this.spy()];
                var func = F.compose(spies);

                assert.equals(func(), 13);
            },

            "composes two rather ordinary functions": function () {
                var fn = function (a) { return a - 4; };
                var fi = F.partial(seq.select, cull.identity);
                var composed = F.compose([fi, seq.map]);

                assert.equals(composed(fn, [4, 5, 6, 7]), [1, 2, 3]);
            },

            "as method calls all functions with correct this": function () {
                var fns = [this.spy(), this.spy()];
                var object = { method: F.compose(fns) };
                object.method();

                assert.calledOn(fns[0], object);
                assert.calledOn(fns[1], object);
            }
        },

        "partial": {
            "schönfinkelizes": function () {
                var fn = function (a, b) { return a + b; };
                var curried = F.partial(fn, 3);
                assert.equals(curried(5), 8);
            },

            "passes partial arguments before actual arguments": function () {
                var fn = function (a, b) { return a - b; };
                var partial = F.partial(fn, 5);
                assert.equals(partial(2), 3);
            },

            "binds select transform": function () {
                var fi = F.partial(seq.select, cull.identity);
                assert.equals(fi([0, 1, 2]), [1, 2]);
            }
        },

        "bind": {
            "calls function with bound this object": function () {
                var func = this.spy();
                var obj = {};
                var bound = F.bind(obj, func);

                bound();
                assert.equals(func.thisValues[0], obj);

                bound.call({});
                assert.equals(func.thisValues[1], obj);

                bound.apply({});
                assert.equals(func.thisValues[2], obj);
            },

            "calls method with bound this object": function () {
                var obj = { meth: this.spy() };
                var bound = F.bind(obj, "meth");

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
                var bound = F.bind(obj, func, 42, "Hey");

                bound();

                assert(func.calledWith(42, "Hey"));
            },

            "calls function with bound arguments and passed arguments": function () {
                var func = this.spy();
                var obj = {};
                var bound = F.bind(obj, func, 42, "Hey");

                bound("Bound", []);
                assert(func.calledWith(42, "Hey", "Bound", []));

                bound.call(null, ".call", []);
                assert(func.calledWith(42, "Hey", ".call", []));

                bound.apply(null, [".apply", []]);
                assert(func.calledWith(42, "Hey", ".apply", []));
            }
        },

        "handler": {
            "returns function untouched": function () {
                var fn = function () {};
                var handler = F.handler(fn, "eventName");
                assert.same(fn, handler);
            },

            "returns function that calls method on object": function () {
                var object = { click: this.spy() };
                var handler = F.handler(object, "click");
                handler();

                assert.calledOnce(object.click);
                assert.calledOn(object.click, object);
            },

            "handler returns method's return value": function () {
                var object = { click: this.stub().returns(42) };
                var handler = F.handler(object, "click");
                var result = handler();

                assert.equals(result, 42);
            },

            "handler is called with arguments": function () {
                var object = { click: this.stub().returns(42) };
                var handler = F.handler(object, "click");
                var result = handler(42, { id: 13 });

                assert.calledWith(object.click, 42, { id: 13 });
            },

            "handler binds arguments": function () {
                var object = { click: this.stub().returns(42) };
                var handler = F.handler(object, "click", 42);
                var result = handler("Yo");

                assert.calledWith(object.click, 42, "Yo");
            },

            "throws if handler object does not have method": function () {
                var object = {};

                assert.exception(function () {
                    var handler = F.handler(object, "click");
                });
            },

            "throws if handler object property is not a function": function () {
                var object = { click: 42 };

                assert.exception(function () {
                    var handler = F.handler(object, "click");
                });
            }
        }
    });
}());