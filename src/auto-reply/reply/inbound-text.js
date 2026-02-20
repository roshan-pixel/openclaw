"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeInboundTextNewlines = normalizeInboundTextNewlines;
function normalizeInboundTextNewlines(input) {
    return input.replaceAll("\r\n", "\n").replaceAll("\r", "\n").replaceAll("\\n", "\n");
}
