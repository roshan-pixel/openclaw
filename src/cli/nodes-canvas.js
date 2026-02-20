"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCanvasSnapshotPayload = parseCanvasSnapshotPayload;
exports.canvasSnapshotTempPath = canvasSnapshotTempPath;
var node_crypto_1 = require("node:crypto");
var os = require("node:os");
var path = require("node:path");
var cli_name_js_1 = require("./cli-name.js");
function asRecord(value) {
    return typeof value === "object" && value !== null ? value : {};
}
function asString(value) {
    return typeof value === "string" ? value : undefined;
}
function parseCanvasSnapshotPayload(value) {
    var obj = asRecord(value);
    var format = asString(obj.format);
    var base64 = asString(obj.base64);
    if (!format || !base64) {
        throw new Error("invalid canvas.snapshot payload");
    }
    return { format: format, base64: base64 };
}
function canvasSnapshotTempPath(opts) {
    var _a, _b;
    var tmpDir = (_a = opts.tmpDir) !== null && _a !== void 0 ? _a : os.tmpdir();
    var id = (_b = opts.id) !== null && _b !== void 0 ? _b : (0, node_crypto_1.randomUUID)();
    var ext = opts.ext.startsWith(".") ? opts.ext : ".".concat(opts.ext);
    var cliName = (0, cli_name_js_1.resolveCliName)();
    return path.join(tmpDir, "".concat(cliName, "-canvas-snapshot-").concat(id).concat(ext));
}
