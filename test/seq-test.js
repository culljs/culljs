if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";
    var S = cull.seq;
    var F = cull.fn;

    buster.testCase("cull.seq", {
        "concat": {
            "concatenates lists": function () {
                var a = [1, 2, 3];
                var b = [4, 5, 6];
                assert.equals(S.concat(a, b), [1, 2, 3, 4, 5, 6]);
            },

            "doesn't mutate original lists": function () {
                var a = [1, 2, 3];
                var b = [4, 5, 6];
                S.concat(a, b);
                assert.equals(a, [1, 2, 3]);
                assert.equals(b, [4, 5, 6]);
            },

            "concatenates arguments": function () {
                var args = function () { return arguments; };
                var a = args(1, 2, 3);
                var b = args(4, 5, 6);
                assert.equals(S.concat(a, b), [1, 2, 3, 4, 5, 6]);
            }
        },

        "map": {
            "squares numbers": function () {
                var square = function (num) { return num * num; };
                assert.equals(S.map(square, [1, 2, 3]), [1, 4, 9]);
            }
        },

        "mapcat": {
            "concatenates the results of map": function () {
                var dbl = function (single) { return [single, single]; };
                assert.equals(
                    S.mapcat(dbl, [1, 2, 3]),
                    [1, 1, 2, 2, 3, 3]
                );
            }
        },

        "select": {
            "with identity removes falsy values": function () {
                var items = [0, 1, 2, null, 3, 4, undefined, 5, 6];
                var result = S.select(function (i) { return !!i; }, items);
                assert.equals(result, [1, 2, 3, 4, 5, 6]);
            }
        },

        "reject": {
            "keep only elements that does not match predicate": function () {
                var items = [1, 2, 3, 4, 5];
                var odd = function (n) { return n % 2; };
                assert.equals(S.reject(odd, items), [2, 4]);
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
                assert.equals(S.mapdef(fn, this.list), [1, 2, 3]);
            },

            "excludes nulls from result": function () {
                this.list[2].id = null;
                var fn = F.prop("id");
                assert.equals(S.mapdef(fn, this.list), [1, 2, 3]);
            },

            "does not exclude zeroes from result": function () {
                this.list[2].id = 0;
                var fn = F.prop("id");
                assert.equals(S.mapdef(fn, this.list), [1, 2, 0, 3]);
            },

            "does not call fn with undefined values": function () {
                this.list[2] = null;
                var fn = F.prop("id");
                assert.equals(S.mapdef(fn, this.list), [1, 2, 3]);
            }
        },

        "partition": {
            "splits a sequence into n-sized chunks": function () {
                var n = 2;
                var result = S.partition(n, [1, 2]);
                assert.equals(result, [[1, 2]]);
            },

            "splits a longer sequence": function () {
                var result = S.partition(2, [1, 2, 3, 4]);
                assert.equals(result, [[1, 2], [3, 4]]);
            },

            "splits into larger chunks": function () {
                var result = S.partition(3, [1, 2, 3, 4, 5, 6]);
                assert.equals(result, [[1, 2, 3], [4, 5, 6]]);
            },

            "keeps incomplete partitions": function () {
                var result = S.partition(2, [1, 2, 3, 4, 5]);
                assert.equals(result, [[1, 2], [3, 4], [5]]);
            }
        }
    });
}());
