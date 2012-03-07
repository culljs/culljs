if (typeof require === "function" && typeof module !== "undefined") {
    var buster = require("buster");
    var cull = require("../lib/cull");
}

(function () {
    "use strict";
    var seq = cull.seq;
    var F = cull.fn;

    buster.testCase("cull.seq", {
        "map": {
            "squares numbers": function () {
                var square = function (num) { return num * num; };
                assert.equals(seq.map(square, [1, 2, 3]), [1, 4, 9]);
            }
        },

        "select": {
            "with identity removes falsy values": function () {
                var items = [0, 1, 2, null, 3, 4, undefined, 5, 6];
                var result = seq.select(function (i) { return !!i; }, items);
                assert.equals(result, [1, 2, 3, 4, 5, 6]);
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
                assert.equals(seq.mapdef(fn, this.list), [1, 2, 3]);
            },

            "excludes nulls from result": function () {
                this.list[2].id = null;
                var fn = F.prop("id");
                assert.equals(seq.mapdef(fn, this.list), [1, 2, 3]);
            },

            "does not exclude zeroes from result": function () {
                this.list[2].id = 0;
                var fn = F.prop("id");
                assert.equals(seq.mapdef(fn, this.list), [1, 2, 0, 3]);
            },

            "does not call fn with undefined values": function () {
                this.list[2] = null;
                var fn = F.prop("id");
                assert.equals(seq.mapdef(fn, this.list), [1, 2, 3]);
            }
        }
    });
}());
