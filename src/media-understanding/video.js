"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateBase64Size = estimateBase64Size;
exports.resolveVideoMaxBase64Bytes = resolveVideoMaxBase64Bytes;
var defaults_js_1 = require("./defaults.js");
function estimateBase64Size(bytes) {
    return Math.ceil(bytes / 3) * 4;
}
function resolveVideoMaxBase64Bytes(maxBytes) {
    var expanded = Math.floor(maxBytes * (4 / 3));
    return Math.min(expanded, defaults_js_1.DEFAULT_VIDEO_MAX_BASE64_BYTES);
}
