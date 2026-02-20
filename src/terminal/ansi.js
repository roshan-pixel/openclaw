"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripAnsi = stripAnsi;
exports.visibleWidth = visibleWidth;
var ANSI_SGR_PATTERN = "\\x1b\\[[0-9;]*m";
// OSC-8 hyperlinks: ESC ] 8 ; ; url ST ... ESC ] 8 ; ; ST
var OSC8_PATTERN = "\\x1b\\]8;;.*?\\x1b\\\\|\\x1b\\]8;;\\x1b\\\\";
var ANSI_REGEX = new RegExp(ANSI_SGR_PATTERN, "g");
var OSC8_REGEX = new RegExp(OSC8_PATTERN, "g");
function stripAnsi(input) {
    return input.replace(OSC8_REGEX, "").replace(ANSI_REGEX, "");
}
function visibleWidth(input) {
    return Array.from(stripAnsi(input)).length;
}
