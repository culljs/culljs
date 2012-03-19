/*jslint es5: true*/
function expose(mod) {
    Object.defineProperty(exports, mod, {
        get: function () {
            this["_" + mod] = this["_" + mod] || require("./" + mod);
            return this["_" + mod];
        },

        set: function (value) {
            throw new Error("Unwritable property " + mod);
        }
    });
}

expose("seq");
expose("fn");
expose("dom");

var prop, core = require("./core");

for (prop in core) {
    if (core.hasOwnProperty(prop)) {
        exports[prop] = core[prop];
    }
}
