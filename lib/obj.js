var cull = cull || require("./core");
var _ = _ || require("underscore");

//"use locals";

cull.obj = {
    keys: _.keys,
    values: _.values
};

module.exports = cull.obj;
