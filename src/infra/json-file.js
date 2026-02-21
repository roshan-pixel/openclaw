"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJsonFile = loadJsonFile;
exports.saveJsonFile = saveJsonFile;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
function loadJsonFile(pathname) {
  try {
    if (!node_fs_1.default.existsSync(pathname)) {
      return undefined;
    }
    var raw = node_fs_1.default.readFileSync(pathname, "utf8");
    return JSON.parse(raw);
  } catch (_a) {
    return undefined;
  }
}
function saveJsonFile(pathname, data) {
  var dir = node_path_1.default.dirname(pathname);
  if (!node_fs_1.default.existsSync(dir)) {
    node_fs_1.default.mkdirSync(dir, { recursive: true, mode: 448 });
  }
  node_fs_1.default.writeFileSync(pathname, "".concat(JSON.stringify(data, null, 2), "\n"), "utf8");
  node_fs_1.default.chmodSync(pathname, 384);
}
