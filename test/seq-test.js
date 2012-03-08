if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";
    var S = cull.seq;
    var F = cull.fn;

    buster.testCase("cull.seq", {
        "map": {
            "squares numbers": function () {
                var square = function (num) { return num * num; };
                assert.equals(S.map(square, [1, 2, 3]), [1, 4, 9]);
            }
        },

        "select": {
            "with identity removes falsy values": function () {
                var items = [0, 1, 2, null, 3, 4, undefined, 5, 6];
                var result = S.select(function (i) { return !!i; }, items);
                assert.equals(result, [1, 2, 3, 4, 5, 6]);
            }
        },

        "reduce": {
            "sums numbers": function () {
                var seq = [1, 2, 3, 4];
                var add = function (a, b) { return a + b; };
                assert.equals(S.reduce(add, seq), 10);
            },

            "sums numbers with seed value": function () {
                var seq = [1, 2, 3, 4];
                var add = function (a, b) { return a + b; };
                assert.equals(S.reduce(add, 5, seq), 15);
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

        "cut": {
            "returns sequence of n sequences": function () {
                var n = 1;
                var result = S.cut(1, [0]);
                assert.equals(result, [[0]]);
            },

            "distributes items evenly across sequences": function () {
                var result = S.cut(2, [1, 2, 3, 4, 5, 6]);
                assert.equals(result, [[1, 2, 3], [4, 5, 6]]);
            },

            "puts superfluous element in first sequence": function () {
                var result = S.cut(3, [1, 2, 3, 4, 5, 6, 7]);
                assert.equals(result, [[1, 2, 3], [4, 5], [6, 7]]);
            },

            "fills extra elements from left to right": function () {
                var result = S.cut(4, [1, 2, 3, 4, 5, 6, 7]);
                assert.equals(result, [[1, 2], [3, 4], [5, 6], [7]]);
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
