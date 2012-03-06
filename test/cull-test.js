if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";
    var F = cull.fn;

    buster.testCase("fn module", {
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
                var fi = F.partial(F.select, F.identity);
                var composed = F.compose([fi, F.map]);

                assert.equals(composed(fn, [4, 5, 6, 7]), [1, 2, 3]);
            }
        },

        "prop": {
            "returns named property from object": function () {
                assert.equals(F.prop("id")({ id: 42 }), 42);
            },

            "returns undefined when property does not exist": function () {
                refute.defined(F.prop("id")(42));
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
                var fi = F.partial(F.select, F.identity);
                assert.equals(fi([0, 1, 2]), [1, 2]);
            }
        },

        "map": {
	    "squares numbers": function () {
                var square = function (num) { return num * num; };
                assert.equals(F.map(square, [1, 2, 3]), [1, 4, 9]);
            }
        },

        "select": {
	    "with identity removes falsy values": function () {
                var items = [0, 1, 2, null, 3, 4, undefined, 5, 6];
                var result = F.select(function (i) { return !!i; }, items);
                assert.equals(result, [1, 2, 3, 4, 5, 6]);
            }
        },

        "identity": {
            "returns first argument": function () {
                assert.equals(F.identity(4, 2), 4);
            },

            "returns null": function () {
                assert.equals(F.identity(null), null);
            },

            "returns undefined without arguments": function () {
                assert.equals(F.identity(), undefined);
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
                var fn = F.prop("id");
                assert.equals(F.mapdef(fn, this.list), [1, 2, 3]);
            },

            "excludes nulls from result": function () {
                this.list[2].id = null;
                var fn = F.prop("id");
                assert.equals(F.mapdef(fn, this.list), [1, 2, 3]);
            },

            "does not exclude zeroes from result": function () {
                this.list[2].id = 0;
                var fn = F.prop("id");
                assert.equals(F.mapdef(fn, this.list), [1, 2, 0, 3]);
            },

            "does not call fn with undefined values": function () {
                this.list[2] = null;
                var fn = F.prop("id");
                assert.equals(F.mapdef(fn, this.list), [1, 2, 3]);
            }
        }
    });
}());