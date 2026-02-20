"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCS_ROOT = void 0;
exports.formatDocsLink = formatDocsLink;
exports.formatDocsRootLink = formatDocsRootLink;
var utils_js_1 = require("../utils.js");
exports.DOCS_ROOT = "https://docs.openclaw.ai";
function formatDocsLink(path, label, opts) {
    var _a;
    var trimmed = path.trim();
    var url = trimmed.startsWith("http")
        ? trimmed
        : "".concat(exports.DOCS_ROOT).concat(trimmed.startsWith("/") ? trimmed : "/".concat(trimmed));
    return (0, utils_js_1.formatTerminalLink)(label !== null && label !== void 0 ? label : url, url, {
        fallback: (_a = opts === null || opts === void 0 ? void 0 : opts.fallback) !== null && _a !== void 0 ? _a : url,
        force: opts === null || opts === void 0 ? void 0 : opts.force,
    });
}
function formatDocsRootLink(label) {
    return (0, utils_js_1.formatTerminalLink)(label !== null && label !== void 0 ? label : exports.DOCS_ROOT, exports.DOCS_ROOT, {
        fallback: exports.DOCS_ROOT,
    });
}
