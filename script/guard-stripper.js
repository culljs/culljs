var ZeParser = require("zeparser").ZeParser;

function tokens(code) {
    var parser = ZeParser.createParser(code);
    parser.tokenizer.fixValues();
    return parser.tokenizer.wtree;
}

function declPos(decl, code) {
    var beg, end;
    tokens(code).forEach(function (t) {
        if (t.value === decl && t.functionStack) {
            beg = t.functionStack[0].start;
            var last = t.functionStack[t.functionStack.length - 1];
            end = last[last.length - 1].stop;
        }
    });
    return [beg, end];
}

function stripGuards(code) {
    var isGuard = false, parens = 0;
    return tokens(code).map(function (t) {
        if (t.meta === "func decl name") { return t.value; }
        var value = t.value;
        var startsGuard = ["_assert", "_refute"].indexOf(value) >= 0;
        if (startsGuard) { isGuard = true; }
        if (isGuard && !t.functionStack) { value = ""; }
        if (isGuard && t.value === "(") { parens += 1; }
        if (isGuard && t.value === ")") { parens -= 1; }
        if (!startsGuard && isGuard && parens === 0 && /[\s\t\n;]/.test(t.value)) { isGuard = false; }
        return value;
    }).join("");
}

function stripDecl(code, pos) {
    if (!pos || pos.length !== 2 ||
        typeof pos[0] !== "number" || typeof pos[1] !== "number") {
        return code;
    }
    return code.slice(0, pos[0]) + code.slice(pos[1]);
}

function stripGuardDecls(code) {
    var assertLess = stripDecl(code, declPos("_assert", code));
    return stripDecl(assertLess, declPos("_refute", assertLess));
}

module.exports = {
    tokens: tokens,
    declPos: declPos,
    stripGuardDecls: stripGuardDecls,
    stripGuards: stripGuards
};
