"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRuntime = void 0;
var progress_line_js_1 = require("./terminal/progress-line.js");
exports.defaultRuntime = {
    log: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (0, progress_line_js_1.clearActiveProgressLine)();
        console.log.apply(console, args);
    },
    error: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (0, progress_line_js_1.clearActiveProgressLine)();
        console.error.apply(console, args);
    },
    exit: function (code) {
        process.exit(code);
        throw new Error("unreachable"); // satisfies tests when mocked
    },
};
