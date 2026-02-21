"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendRawStream = appendRawStream;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var env_js_1 = require("../infra/env.js");
var RAW_STREAM_ENABLED = (0, env_js_1.isTruthyEnvValue)(process.env.OPENCLAW_RAW_STREAM);
var RAW_STREAM_PATH =
  ((_a = process.env.OPENCLAW_RAW_STREAM_PATH) === null || _a === void 0 ? void 0 : _a.trim()) ||
  node_path_1.default.join((0, paths_js_1.resolveStateDir)(), "logs", "raw-stream.jsonl");
var rawStreamReady = false;
function appendRawStream(payload) {
  if (!RAW_STREAM_ENABLED) {
    return;
  }
  if (!rawStreamReady) {
    rawStreamReady = true;
    try {
      node_fs_1.default.mkdirSync(node_path_1.default.dirname(RAW_STREAM_PATH), {
        recursive: true,
      });
    } catch (_a) {
      // ignore raw stream mkdir failures
    }
  }
  try {
    void node_fs_1.default.promises.appendFile(
      RAW_STREAM_PATH,
      "".concat(JSON.stringify(payload), "\n"),
    );
  } catch (_b) {
    // ignore raw stream write failures
  }
}
