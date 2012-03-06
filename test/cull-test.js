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
            }
        }
    });
}());