"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripDsrRequests = stripDsrRequests;
exports.buildCursorPositionResponse = buildCursorPositionResponse;
var ESC = String.fromCharCode(0x1b);
var DSR_PATTERN = new RegExp("".concat(ESC, "\\[\\??6n"), "g");
function stripDsrRequests(input) {
    var requests = 0;
    var cleaned = input.replace(DSR_PATTERN, function () {
        requests += 1;
        return "";
    });
    return { cleaned: cleaned, requests: requests };
}
function buildCursorPositionResponse(row, col) {
    if (row === void 0) { row = 1; }
    if (col === void 0) { col = 1; }
    return "\u001B[".concat(row, ";").concat(col, "R");
}
