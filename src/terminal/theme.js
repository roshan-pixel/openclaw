"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorize = exports.isRich = exports.theme = void 0;
var chalk_1 = require("chalk");
var palette_js_1 = require("./palette.js");
var hasForceColor = typeof process.env.FORCE_COLOR === "string" &&
    process.env.FORCE_COLOR.trim().length > 0 &&
    process.env.FORCE_COLOR.trim() !== "0";
var baseChalk = process.env.NO_COLOR && !hasForceColor ? new chalk_1.Chalk({ level: 0 }) : chalk_1.default;
var hex = function (value) { return baseChalk.hex(value); };
exports.theme = {
    accent: hex(palette_js_1.LOBSTER_PALETTE.accent),
    accentBright: hex(palette_js_1.LOBSTER_PALETTE.accentBright),
    accentDim: hex(palette_js_1.LOBSTER_PALETTE.accentDim),
    info: hex(palette_js_1.LOBSTER_PALETTE.info),
    success: hex(palette_js_1.LOBSTER_PALETTE.success),
    warn: hex(palette_js_1.LOBSTER_PALETTE.warn),
    error: hex(palette_js_1.LOBSTER_PALETTE.error),
    muted: hex(palette_js_1.LOBSTER_PALETTE.muted),
    heading: baseChalk.bold.hex(palette_js_1.LOBSTER_PALETTE.accent),
    command: hex(palette_js_1.LOBSTER_PALETTE.accentBright),
    option: hex(palette_js_1.LOBSTER_PALETTE.warn),
};
var isRich = function () { return Boolean(baseChalk.level > 0); };
exports.isRich = isRich;
var colorize = function (rich, color, value) {
    return rich ? color(value) : value;
};
exports.colorize = colorize;
